import { Injectable, LoggerService, LogLevel } from '@nestjs/common';

function toTskv(obj: Record<string, string>) {
  return Object.entries(obj)
    .map(([k, v]) => `${k}=${v.replace(/\t/g, ' ').replace(/\n/g, ' ')}`)
    .join('\t');
}

@Injectable()
export class TskvLogger implements LoggerService {
  private write(level: LogLevel, message: any, ...meta: any[]) {
    const base = {
      time: new Date().toISOString(),
      level,
      message: typeof message === 'string' ? message : JSON.stringify(message),
    };
    const extras = meta.length ? { meta: JSON.stringify(meta) } : {};
    console.log(toTskv({ ...base, ...extras }));
  }

  log(message: any, ...meta: any[]) {
    this.write('log', message, ...meta);
  }
  error(message: any, ...meta: any[]) {
    this.write('error', message, ...meta);
  }
  warn(message: any, ...meta: any[]) {
    this.write('warn', message, ...meta);
  }
  debug(message: any, ...meta: any[]) {
    this.write('debug', message, ...meta);
  }
  verbose(message: any, ...meta: any[]) {
    this.write('verbose', message, ...meta);
  }
}
