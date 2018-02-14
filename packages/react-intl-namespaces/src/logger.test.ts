import * as Logger from './logger';

const { configureLogger, Level, setConsole } = Logger;
const ConsoleMock = jest.fn<Console>(() => ({
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
}));

describe('Logger', () => {
  it('should should not log by default', () => {
    const consoleMock = new ConsoleMock();
    const { logger } = Logger;
    setConsole(consoleMock);

    logger.debug('debug');
    logger.info('info');
    logger.error('error');

    expect(consoleMock).toMatchSnapshot();
  });
  it('should log error only to console when configured accordingly', () => {
    const consoleMock = new ConsoleMock();

    setConsole(consoleMock);
    configureLogger(Level.error);
    const { logger } = Logger;

    logger.debug('debug');
    logger.info('info');
    logger.error('error');

    expect(consoleMock).toMatchSnapshot();
  });
  it('should log info only to console when configured accordingly', () => {
    const consoleMock = new ConsoleMock();
    setConsole(consoleMock);
    configureLogger(Level.info);

    const { logger } = Logger;

    logger.debug('debug');
    logger.info('info');
    logger.error('error');

    expect(consoleMock).toMatchSnapshot();
  });
  it('should log debug only to console when configured accordingly', () => {
    const consoleMock = new ConsoleMock();

    setConsole(consoleMock);
    configureLogger(Level.debug);
    const { logger } = Logger;

    logger.debug('debug');
    logger.info('info');
    logger.error('error');

    expect(consoleMock).toMatchSnapshot();
  });
});
