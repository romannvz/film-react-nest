import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configProvider } from './app.config.provider';

async function bootstrap() {
  const configService = new ConfigService();
  const appConfig = configProvider.useFactory(configService);
  const app = await NestFactory.create(AppModule.register(appConfig), {
    bufferLogs: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/afisha');
  app.enableCors({
    origin: [
      'http://localhost:5173/',
      'https://front.romannvz.nomorepartiessbs.ru/',
      'http://front.romannvz.nomorepartiessbs.ru/',
    ],
  });
  app.useLogger(appConfig.logger?.instance || console);
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
