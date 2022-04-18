import { Module } from '@nestjs/common';
import { TmdbTasksModule } from './tmdb/tasks/tasks.module';

@Module({
    imports: [TmdbTasksModule],
})
export class TasksModule { }