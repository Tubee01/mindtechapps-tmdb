import { Inject } from "@nestjs/common";
import { PoolClient } from "pg";
import { CONNECTION } from "src/utils/constants";
import { Director } from "../dto/director.dto";
import { Genre } from "../dto/genre.dto";
import { Movie } from "../dto/movie.dto";
import { Person } from "../dto/person.dto";
import { Vote } from "../dto/vote.dto";
import { TmdbDatabaseProvider } from "../tmdb";

export class DatabaseService implements TmdbDatabaseProvider {
    constructor(@Inject(CONNECTION) private pool: PoolClient) { }
    async syncDatabase(movies: Movie[], genres: Genre[], directors: Director[], persons: Person[]) {
        // clear tables 
        this.pool.query('truncate table director CASCADE;')
        this.pool.query('truncate table person CASCADE;')
        this.pool.query('truncate table vote CASCADE;')
        this.pool.query('truncate table movie CASCADE;')
        this.pool.query('truncate table genre CASCADE;')

        // clear duplicated rows
        directors = directors.filter((arr, index, self) =>
            index === self.findIndex((t) => (t.id === arr.id)))

        // add full path url
        movies.map((movie, i) => {
            movies[i] = {
                ...movie,
                poster_path: 'https://image.tmdb.org/t/p/original' + movie.poster_path,
                url: 'https://www.themoviedb.org/movie/' + movie.id
            }
        })
        // send it
        try {
            const [saveMovie, saveGenre, saveDirector, savePerson, saveVote] = await Promise.all([
                this.insertMovie(movies),
                this.insertGenre(genres),
                this.insertDirector(directors),
                this.insertPerson(persons),
                this.insertVote(movies as Vote[])
            ])
            return { saveGenre, saveMovie, saveDirector, savePerson, saveVote }
        } catch (error) {
            return error
        }
    }
    insertGenre(args: Genre | Genre[]) {
        const text = 'INSERT INTO genre(tmdb_id, name) VALUES($1, $2) RETURNING *'
        if (Array.isArray(args)) {
            return Promise.all(args.map((item) => this.pool.query(text, [item.id, item.name]).then((resp) => resp.rowCount)))
        }
        return this.pool.query(text, [args.id, args.name]).then((resp) => resp.rowCount)
    }
    insertMovie(args: Movie | Movie[]) {
        const text = 'INSERT INTO movie(tmdb_id, title, genre_ids, director_ids, runtime, release_date, overview, poster_path, url) VALUES($1, $2, $3, $4, $5 , $6, $7, $8, $9) RETURNING *'
        if (Array.isArray(args)) {
            return Promise.all(args.map((item) => this.pool.query(text, [item.id, item.title, item.genre_ids, item.director_ids, item.runtime, item.release_date, item.overview, item.poster_path, item.url]).then((resp) => resp.rowCount)))
        }
        return this.pool.query(text, [args.id, args.title, args.genre_ids, args.director_ids, args.runtime, args.release_date, args.overview, args.poster_path, args.url]).then((resp) => resp.rowCount)
    }
    insertDirector(args: Director | Director[]) {
        const text = 'INSERT INTO director(tmdb_id, name) VALUES($1, $2) RETURNING *'
        if (Array.isArray(args)) {
            return Promise.all(args.map((item) => this.pool.query(text, [item.id, item.name]).then((resp) => resp.rowCount)))
        }
        return this.pool.query(text, [args.id, args.name]).then((resp) => resp.rowCount)
    }
    insertPerson(args: Person | Person[]) {
        const text = 'INSERT INTO person(director_id, biography, date_of_birth) VALUES($1, $2, $3) RETURNING *'
        if (Array.isArray(args)) {
            return Promise.all(args.map((item) => this.pool.query(text, [item.id, item.biography, item.birthday]).then((resp) => resp.rowCount)))
        }
        return this.pool.query(text, [args.id, args.biography, args.birthday]).then((resp) => resp.rowCount)
    }
    insertVote(args: Vote | Vote[]) {
        const text = 'INSERT INTO vote(movie_id, vote_count, vote_average) VALUES($1, $2 , $3) RETURNING *'
        if (Array.isArray(args)) {
            return Promise.all(args.map((item) => this.pool.query(text, [item.id, item.vote_count, item.vote_average]).then((resp) => resp.rowCount)))
        }
        return this.pool.query(text, [args.id, args.vote_count, args.vote_average]).then((resp) => resp.rowCount)
    }
}