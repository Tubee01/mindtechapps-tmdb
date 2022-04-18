import { Module } from '@nestjs/common';
import { TmdbModule } from '../tmdb.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [TmdbModule],
  providers: [TasksService],
})
export class TmdbTasksModule { }