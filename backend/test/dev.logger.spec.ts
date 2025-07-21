import { DevLogger } from '../src/loggers/dev.logger';
import { LoggerService } from '@nestjs/common';

describe('DevLogger', () => {
  let logger: LoggerService;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    logger = new DevLogger();
    spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('should log with console.log', () => {
    (logger as any).log('hello', 'meta1');
    expect(spy).toHaveBeenCalled();
    const msg = spy.mock.calls[0][0];
    expect(msg).toContain('hello');
  });

  it('should warn with console.warn', () => {
    const w = jest.spyOn(console, 'warn').mockImplementation(() => {});
    (logger as any).warn('warn msg');
    expect(w).toHaveBeenCalledWith(expect.stringContaining('warn msg'));
    w.mockRestore();
  });

  it('should error with console.error', () => {
    const e = jest.spyOn(console, 'error').mockImplementation(() => {});
    (logger as any).error('err msg', 'trace');
    expect(e).toHaveBeenCalledWith(expect.stringContaining('err msg'));
    e.mockRestore();
  });
});
