import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { lastValueFrom, map } from 'rxjs';
import { Director } from 'src/tmdb/dto/director.dto';
import { Genre } from 'src/tmdb/dto/genre.dto';
import { GetMovieGenresResponse } from 'src/tmdb/dto/getMovieGenresResponse.dto';
import { Movie } from 'src/tmdb/dto/movie.dto';
import { Person } from 'src/tmdb/dto/person.dto';
import { DatabaseService } from 'src/tmdb/services/database.service';
import { TmdbService } from 'src/tmdb/services/tmdb.service';
import { CRON_STRING, TOP_MOVIES_SIZE } from 'src/utils/constants';
import { ApiCallsService } from '../services/api-calls.service';

type FetchedData = {
  genres: Genre[]
  movies: Movie[]
  moviesAndDirectors: Array<{ movie: Movie, directors: Director[] }>
  dataOfDirectors: Person[]
}



@Injectable()
export class TasksService implements OnModuleInit {
  constructor(
    private readonly api: ApiCallsService,
    private readonly database: DatabaseService,
    private readonly tmdbService: TmdbService,
    private readonly config: ConfigService,
    private schedulerRegistry: SchedulerRegistry

  ) { }

  onModuleInit() {

    // sync on app start
    this.handleCron()

    const job = new CronJob(this.config.get(CRON_STRING),() => this.handleCron());
    this.schedulerRegistry.addCronJob('sync-database', job)
    job.start()
  }
  private readonly logger = new Logger('TmdbTasksService');
  async handleCron() {
    const chunkArray = (arr, size) =>
      arr.length > size
        ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
        : [arr];
    this.logger.debug('Sync started...');
    const maxMovieRowCount = this.config.get(TOP_MOVIES_SIZE) || 210;
    let fetchedData: FetchedData = {
      movies: [],
      genres: [],
      moviesAndDirectors: [],
      dataOfDirectors: []

    };


    try {
      let topMovies = await this.tmdbService.getTopMoviesWithMax(maxMovieRowCount)
      var batches = chunkArray(topMovies, 100)
      for (let index = 0; index < batches.length; index++) {
        fetchedData.moviesAndDirectors = [...fetchedData.moviesAndDirectors, ...await Promise.all(batches[index].map((movie) => this.tmdbService.getMovieAndDirectors(movie.id)))];
      }
      var batches1 = chunkArray(fetchedData.moviesAndDirectors, 100)
      for (let index = 0; index < batches1.length; index++) {
        await Promise.all(batches1[index].map(async (item) => {
          let { movie, directors } = item;
          let director_ids = [], genre_ids = [];
          directors.map((director) => director_ids.push(director.id))
          movie.genres.map((genre) => genre_ids.push(genre.id))
          movie = {
            ...movie,
            genre_ids,
            director_ids,
          }
          fetchedData.movies = [...fetchedData.movies, movie]
          if (directors) {
            await Promise.all(directors.map(async (director) => {
              const person = await lastValueFrom(this.api.getPerson(director.id))
              if (person)
                fetchedData.dataOfDirectors = [...fetchedData.dataOfDirectors, person as Person]
            }))

          }
        }))
      }

      const { genres } = await lastValueFrom(this.api.getMovieGenres()) as GetMovieGenresResponse
      fetchedData = { ...fetchedData, genres }
      await this.database.syncDatabase(fetchedData.movies, fetchedData.genres, fetchedData.dataOfDirectors, fetchedData.dataOfDirectors)
    } catch (error) {
      this.logger.error(error)
    }
    this.logger.debug(`Fetched movies: ${fetchedData.movies.length}`)
    this.logger.debug(`Fetched genres: ${fetchedData.genres.length}`)
    this.logger.debug(`Fetched dataOfDirectors: ${fetchedData.dataOfDirectors.length}`)
    this.logger.debug('Sync end...');

  }


}