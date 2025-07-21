import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { LoggerService } from '@nestjs/common';
import { DevLogger } from './loggers/dev.logger';
import { JsonLogger } from './loggers/json.logger';
import { TskvLogger } from './loggers/tskv.logger';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  inject: [ConfigService],
  provide: 'APP_CONFIG',
  useFactory: (config: ConfigService): AppConfig => {
    const driver = config.get<'postgres' | 'mongodb'>('DATABASE_DRIVER');
    if (!driver) throw new Error('DATABASE_DRIVER is not defined in .env');
    const database: AppConfigDatabase = {
      driver: driver,
      postgres: {
        host: config.get<string>('POSTGRES_HOST'),
        port: config.get<number>('POSTGRES_PORT'),
        user: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        db: config.get<string>('POSTGRES_DB'),
      },
      mongoUrl: config.get<string>('DATABASE_URL'),
    };
    const loggerMode =
      config.get<'dev' | 'json' | 'tskv'>('LOGGER_MODE') || 'dev';
    const loggerInstance: LoggerService =
      loggerMode === 'json'
        ? new JsonLogger()
        : loggerMode === 'tskv'
          ? new TskvLogger()
          : new DevLogger();
    return { database, logger: { mode: loggerMode, instance: loggerInstance } };
  },
};

const AppConfigProvider = {
  provide: 'APP_CONFIG',
  useValue: configProvider,
};

export interface AppConfig {
  database: AppConfigDatabase;
  logger: AppConfigLogger;
}

export interface AppConfigDatabase {
  driver: 'postgres' | 'mongodb';
  postgres?: {
    host: string;
    port: number;
    user: string;
    password: string;
    db: string;
  };
  mongoUrl?: string;
}

export interface AppConfigLogger {
  mode: 'dev' | 'json' | 'tskv';
  instance: LoggerService;
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [AppConfigProvider],
  exports: [ConfigModule, AppConfigProvider],
})
export class AppConfigModule {}
