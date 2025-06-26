import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configProvider } from './app.config.provider';

async function bootstrap() {
  const configService = new ConfigService();
  const appConfig = configProvider.useFactory(configService);
  const app = await NestFactory.create(AppModule.register(appConfig));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
