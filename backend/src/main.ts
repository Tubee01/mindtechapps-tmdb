import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { kill } from 'process';
import { AppModule } from './app.module';
import { API_KEY, PORT } from './utils/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService) as any;

  if (config.get(API_KEY).length < 1) {
    throw new Error("API_KEY can not be empty.'");

  }
  await app.listen(config.get(PORT) || 3000);
  console.dir(`I'm listening on  ${await app.getUrl()}`);
}
bootstrap();
