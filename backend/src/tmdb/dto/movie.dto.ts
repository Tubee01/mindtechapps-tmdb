import { Genre } from "./genre.dto"

export type Movie = {
    poster_path?: string | null
    overview?: string
    release_date?: string
    genre_ids?: Array<number>
    id: number
    title?: string
    vote_count?: number
    vote_average?: number
    runtime?: number | null
    url?:string
    director_ids?: Array<number>
    genres?: Genre[]
}