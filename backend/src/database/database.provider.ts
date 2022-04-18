import { ConfigService } from "@nestjs/config";
import { CONNECTION, DATABASE_CONFIG } from "src/utils/constants";
import { PoolManager } from "./database-pool.service";

export const connectionFactory = {
    provide: CONNECTION,
    useFactory:  (optionsProvider: ConfigService, manager: PoolManager) => {
        const options = optionsProvider.get(DATABASE_CONFIG);
        return manager.GetCreateIfNotExistClient(options);
    },
    inject: [ConfigService, PoolManager],
};

