import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { ErrorResponse } from "../dto/error.dto";
import { GetMovieGenresResponse } from "../dto/getMovieGenresResponse.dto";
import { GetMovieWithCreditsResponse } from "../dto/getMovieWithCreditsResponse.dto";
import { GetTopMoviesDTO } from "../dto/getTopMovies.dto";
import { GetTopMoviesResponse } from "../dto/getTopMoviesResponse.dto";
import { Movie } from "../dto/movie.dto";
import { Person } from "../dto/person.dto";
import { TmdbApiProvider } from "../tmdb";

@Injectable()
export class ApiCallsService implements TmdbApiProvider {
    constructor(
        private http: HttpService,
        @Inject('DEFAULTS')
        private settings: { url: string, token: string }

    ) { }
    getMovie(id: number): Observable<Movie | ErrorResponse> {
        try {
            return this.http.get(buildUrl(this.settings, `movie/${id}`)).pipe(
                map(response => response.data)
            );
        } catch (error) {
            throw new Error(error)
        }
    }
    getMovieWithCredits(id: number): Observable<GetMovieWithCreditsResponse | ErrorResponse> {
        try {
            return this.http.get(buildUrl(this.settings, `movie/${id}`, null, 'credits')).pipe(
                map(response => response.data)
            );
        } catch (error) {
            throw new Error(error)
        }
    }
    getTopMovies(args?: GetTopMoviesDTO): Observable<GetTopMoviesResponse | ErrorResponse> {
        try {
            return this.http.get(buildUrl(this.settings, 'movie/top_rated', args)).pipe(
                map(response => response.data)
            );
        } catch (error) {
            throw new Error(error)
        }

    }
    getMovieGenres(): Observable<GetMovieGenresResponse | ErrorResponse> {
        try {
            return this.http.get(buildUrl(this.settings, '/genre/movie/list')).pipe(
                map(response => response.data)
            )
        } catch (error) {
            throw new Error(error)
        }
    }
    getPerson(id: number): Observable<Person | ErrorResponse> {
        try {
            return this.http.get(buildUrl(this.settings, `/person/${id}`)).pipe(
                map(response => response.data)
            )
        } catch (error) {
            throw new Error(error)
        }
    }


}
function buildUrl(settings: { url: string, token: string }, route: string, args: { [key: string]: any } | undefined = undefined, append: Array<string> | string | undefined = undefined) {
    args = { ...args, api_key: settings.token };;
    return `${settings.url.replace('\\/$', '')}${route.replace('\\/$', '')}?${new URLSearchParams(args)}${append ? '&append_to_response=' + (Array.isArray(append) ? append.join(',') : append) : ''}`;
}
