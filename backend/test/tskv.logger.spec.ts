import { TskvLogger } from '../src/loggers/tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('creates TSKV string with keys and tabs', () => {
    logger.log('test', { a: 1 });
    expect(spy).toHaveBeenCalled();
    const output: string = spy.mock.calls[0][0];
    // проверить наличие ключей time, level, message
    expect(output).toMatch(/time=[^\t]+\tlevel=log\tmessage=test/);
    // optional meta
    expect(output).toContain('meta=');
  });

  it('escapes tabs and newlines in values', () => {
    logger.error('err\tmsg\nline2');
    const out: string = spy.mock.calls[0][0];
    expect(out).not.toContain('\tmsg\t'); // таб внутри value должен быть заменён
    expect(out).not.toContain('\nline2');
  });
});
