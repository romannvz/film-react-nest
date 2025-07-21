import { JsonLogger } from '../src/loggers/json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('formats log as JSON with level and message', () => {
    logger.log('my message', { foo: 'bar' });
    expect(spy).toHaveBeenCalledTimes(1);
    const arg = spy.mock.calls[0][0];
    const obj = JSON.parse(arg);
    expect(obj.level).toBe('log');
    expect(obj.message).toBe('my message');
    expect(obj.meta[0]).toEqual({ foo: 'bar' });
    expect(typeof obj.timestamp).toBe('string');
  });

  it('formats error correctly', () => {
    const spyErr = jest.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('oops', 'trace');
    expect(spyErr).toHaveBeenCalledTimes(1);
    const obj = JSON.parse(spyErr.mock.calls[0][0]);
    expect(obj.level).toBe('error');
    expect(obj.message).toBe('oops');
    spyErr.mockRestore();
  });
});
