import { Movie } from "./movie.dto";

export type GetTopMoviesResponse = {
    page: BigInteger;
    results: Movie[];
    total_results: number;
    total_pages: number
}
