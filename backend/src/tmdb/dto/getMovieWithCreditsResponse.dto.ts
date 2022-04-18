import { Movie } from "./movie.dto"

export type GetMovieWithCreditsResponse = {
    credits: Credits
} & Movie

export type Credits = {
    crew: { [key: string]: any }
}