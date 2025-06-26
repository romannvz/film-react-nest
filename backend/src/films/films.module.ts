import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film, FilmSchema } from './film.schema';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from 'src/films/entities/schedule.entity';
import { PostgresFilmsRepository } from 'src/repository/implementations/films-postgres.repository';
import { MongoFilmsRepository } from 'src/repository/implementations/films-mongo.repository';
import { FILMS_REPOSITORY_TOKEN } from 'src/repository/interfaces/films-repository.interface';
import { AppConfigModule } from 'src/app.config.provider';
import { ConfigService } from '@nestjs/config';

@Module({})
export class FilmsModule {
  static registerAsync(driver: string): DynamicModule {
    const isPostgres = driver === 'postgres';
    return {
      module: FilmsModule,
      imports: [
        AppConfigModule,
        isPostgres
          ? TypeOrmModule.forFeature([FilmEntity, ScheduleEntity])
          : MongooseModule.forFeature([
              { name: Film.name, schema: FilmSchema },
            ]),
      ],
      controllers: [FilmsController],
      providers: [
        FilmsService,
        ...(isPostgres ? [PostgresFilmsRepository] : [MongoFilmsRepository]),
        {
          provide: FILMS_REPOSITORY_TOKEN,
          inject: [
            ConfigService,
            ...(isPostgres
              ? [PostgresFilmsRepository]
              : [MongoFilmsRepository]),
          ],
          useFactory: (
            config: ConfigService,
            repo: PostgresFilmsRepository | MongoFilmsRepository,
          ) => {
            return repo;
          },
        },
      ],
      exports: [FilmsService, FILMS_REPOSITORY_TOKEN],
    };
  }
}
