import { Query } from "./query.dto";

export type GetTopMoviesDTO = {
    language?: string;
    page?: number;
    region?: string;
} & Query

