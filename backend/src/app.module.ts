import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './tasks.module';
import { TmdbModule } from './tmdb/tmdb.module';

@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true
  }),
  DatabaseModule,
  TmdbModule,
  TasksModule,
  ScheduleModule.forRoot()],
})
export class AppModule { }
