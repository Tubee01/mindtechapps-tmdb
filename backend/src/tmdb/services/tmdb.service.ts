import { Injectable, Logger } from "@nestjs/common";
import { kill } from "process";
import { lastValueFrom } from "rxjs";
import { ErrorResponse } from "../dto/error.dto";
import { GetMovieWithCreditsResponse } from "../dto/getMovieWithCreditsResponse.dto";
import { GetTopMoviesResponse } from "../dto/getTopMoviesResponse.dto";
import { Movie } from "../dto/movie.dto";
import { TmdbProvider } from "../tmdb";
import { ApiCallsService } from "./api-calls.service";

@Injectable()
export class TmdbService implements TmdbProvider {
  constructor(private readonly api: ApiCallsService) { }
  private readonly logger = new Logger(TmdbService.name);

  async getMovieAndDirectors(id: number) {
    const movie = await lastValueFrom(this.api.getMovieWithCredits(id)) as GetMovieWithCreditsResponse
    const { crew } = movie.credits || {}
    return { movie, directors: crew.filter((member) => member.job === 'Director') }
  }
  async getTopMoviesWithMax(max: number): Promise<Movie[]> {
    let page = 1;
    let _total_pages = 1;
    let fetchedData: Movie[] = [];
    try {
      while (fetchedData.length <= max && page <= _total_pages) {
        const response = await lastValueFrom(this.api.getTopMovies({ page }))
        if ((response as GetTopMoviesResponse).results) {
          const { results , total_pages } = response as GetTopMoviesResponse
          fetchedData = [...fetchedData, ...results]
          _total_pages = total_pages;
          page++;
        }
        else {
          throw new Error((response as ErrorResponse).status_message)
        }
      }
    } catch (error) {
      throw new Error(error)
    }
    fetchedData.splice(max)
    this.logger.debug('fetched page: ' + page)
    return fetchedData

  }

}