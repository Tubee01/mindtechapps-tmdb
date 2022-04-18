import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ApiCallsService } from "./services/api-calls.service";
import { DatabaseService } from "./services/database.service";
import { ConfigService } from "@nestjs/config";
import { API_KEY, API_URL } from "src/utils/constants";
import { TmdbService } from "./services/tmdb.service";

export const settingsFactory = {
    provide: 'DEFAULTS',
    useFactory:  (optonsProvider: ConfigService) => {
        return { url: optonsProvider.get(API_URL), token: optonsProvider.get(API_KEY) }
    },
    inject: [ConfigService],
}

@Module({
    imports: [HttpModule],
    providers: [TmdbService, ApiCallsService, DatabaseService, settingsFactory],
    exports: [HttpModule, TmdbService, ApiCallsService, DatabaseService, settingsFactory]
})
export class TmdbModule { }