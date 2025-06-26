import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film, FilmSchema } from '../films/film.schema';
import { FilmEntity } from '../films/entities/film.entity';
import { ScheduleEntity } from 'src/films/entities/schedule.entity';
import { OrderService } from './orders.service';
import { OrderController } from './orders.controller';
import { MongoOrdersRepository } from '../repository/implementations/orders-mongo.repository';
import { PostgresOrdersRepository } from '../repository/implementations/orders-postgres.repository';
import { ORDERS_REPOSITORY_TOKEN } from '../repository/interfaces/orders-repository.interface';
import { AppConfigModule } from 'src/app.config.provider';
import { ConfigService } from '@nestjs/config';
import { FilmsModule } from 'src/films/films.module';

@Module({})
export class OrderModule {
  static registerAsync(driver: string): DynamicModule {
    const isPostgres = driver === 'postgres';
    return {
      module: OrderModule,
      imports: [
        AppConfigModule,
        FilmsModule.registerAsync(driver),
        isPostgres
          ? TypeOrmModule.forFeature([FilmEntity, ScheduleEntity])
          : MongooseModule.forFeature([
              { name: Film.name, schema: FilmSchema },
            ]),
      ],
      controllers: [OrderController],
      providers: [
        OrderService,
        ...(isPostgres ? [PostgresOrdersRepository] : [MongoOrdersRepository]),
        {
          provide: ORDERS_REPOSITORY_TOKEN,
          inject: [
            ConfigService,
            ...(isPostgres
              ? [PostgresOrdersRepository]
              : [MongoOrdersRepository]),
          ],
          useFactory: (
            config: ConfigService,
            repo: PostgresOrdersRepository | MongoOrdersRepository,
          ) => {
            return repo;
          },
        },
      ],
      exports: [OrderService],
    };
  }
}
