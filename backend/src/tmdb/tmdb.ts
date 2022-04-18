import { Observable } from "rxjs";
import { Director } from "./dto/director.dto";
import { ErrorResponse } from "./dto/error.dto";
import { Genre } from "./dto/genre.dto";
import { GetMovieGenresResponse } from "./dto/getMovieGenresResponse.dto";
import { GetMovieWithCreditsResponse } from "./dto/getMovieWithCreditsResponse.dto";
import { GetTopMoviesDTO } from "./dto/getTopMovies.dto";
import { GetTopMoviesResponse } from "./dto/getTopMoviesResponse.dto";
import { Movie } from "./dto/movie.dto";
import { Person } from "./dto/person.dto";

export interface TmdbApiProvider {
    getMovie(id: number): Observable<Movie | ErrorResponse>
    getMovieWithCredits(id: number): Observable<GetMovieWithCreditsResponse | ErrorResponse>
    getTopMovies(args: GetTopMoviesDTO): Observable<GetTopMoviesResponse | ErrorResponse>
    getMovieGenres(): Observable<GetMovieGenresResponse | ErrorResponse>
    getPerson(id: number): Observable<Person | ErrorResponse>
}

export interface TmdbDatabaseProvider {
    syncDatabase(movies: Movie[], genres: Genre[], directors: Director[], persons: Person[])
    insertGenre(args: Genre | Genre[])
}

export interface TmdbProvider {
    getTopMoviesWithMax(max: number): Promise<Movie[]>
    getMovieAndDirectors(id: number): Promise<{ movie: Movie, directors: Director[] }>
}
