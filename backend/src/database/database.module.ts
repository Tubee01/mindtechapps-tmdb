import { Global, Module, Scope } from '@nestjs/common';
import { CONNECTION } from 'src/utils/constants';
import { PoolManager } from './database-pool.service';
import { connectionFactory } from './database.provider';


@Global()
@Module({
  providers: [PoolManager, connectionFactory],
  exports: [CONNECTION],
})
export class DatabaseModule { }