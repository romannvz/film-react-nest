import { Injectable, LoggerService, LogLevel } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  private format(level: LogLevel, message: any, ...meta: any[]) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
    });
  }

  log(message: any, ...meta: any[]) {
    console.log(this.format('log', message, ...meta));
  }
  error(message: any, ...meta: any[]) {
    console.error(this.format('error', message, ...meta));
  }
  warn(message: any, ...meta: any[]) {
    console.warn(this.format('warn', message, ...meta));
  }
  debug(message: any, ...meta: any[]) {
    console.debug(this.format('debug', message, ...meta));
  }
  verbose(message: any, ...meta: any[]) {
    console.info(this.format('verbose', message, ...meta));
  }
}
