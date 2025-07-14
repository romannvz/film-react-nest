import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

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
    return { database };
  },
};

const AppConfigProvider = {
  provide: 'APP_CONFIG',
  useValue: configProvider,
};

export interface AppConfig {
  database: AppConfigDatabase;
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

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [AppConfigProvider],
  exports: [ConfigModule, AppConfigProvider],
})
export class AppConfigModule {}
