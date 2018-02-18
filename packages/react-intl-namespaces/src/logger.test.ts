import * as Logger from './logger';

const { setLogLevel, LogLevel, mockConsole, createLogger, logger } = Logger;

const ConsoleMock = jest.fn<Console>(() => ({
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
}));
const { error, warn, info, debug } = window.console;

describe('Logger', () => {
  afterEach(() => {
    window.console.debug = debug;
    window.console.info = info;
    window.console.warn = warn;
    window.console.error = error;
  });
  it('should dummy console work ', () => {
    Logger.dummyConsole.debug();
    Logger.dummyConsole.error();
    Logger.dummyConsole.info();
    Logger.dummyConsole.warn();
  });
  it('should should not log by default', () => {
    const consoleMock = new ConsoleMock();
    mockConsole(consoleMock);

    logger.debug('debug');
    logger.info('info');
    logger.error('error');
    logger.warn('warn');

    expect(consoleMock).toMatchSnapshot();
  });
  it('should log error to console when configured accordingly', () => {
    const consoleMock = new ConsoleMock();

    mockConsole(consoleMock);
    setLogLevel(LogLevel.error);

    logger.debug('debug');
    logger.info('info');
    logger.error('error');
    logger.warn('warn');

    expect(consoleMock).toMatchSnapshot();
  });
  it('should log warn error to console when configured accordingly', () => {
    const consoleMock = new ConsoleMock();

    mockConsole(consoleMock);
    setLogLevel(LogLevel.warn);

    logger.debug('debug');
    logger.info('info');
    logger.error('error');
    logger.warn('warn');

    expect(consoleMock).toMatchSnapshot();
  });
  it('should log info warn error to console when configured accordingly', () => {
    const consoleMock = new ConsoleMock();
    mockConsole(consoleMock);
    setLogLevel(LogLevel.info);

    logger.debug('debug');
    logger.info('info');
    logger.error('error');
    logger.warn('warn');

    expect(consoleMock).toMatchSnapshot();
  });
  it('should log debug info warn error to console when configured accordingly', () => {
    const consoleMock = new ConsoleMock();

    mockConsole(consoleMock);
    setLogLevel(LogLevel.debug);

    logger.debug('debug');
    logger.info('info');
    logger.error('error');
    logger.warn('warn');

    expect(consoleMock).toMatchSnapshot();
  });

  it('should log logger name in debug info warn error to console when configured accordingly', () => {
    const consoleMock = new ConsoleMock();

    mockConsole(consoleMock);
    setLogLevel(LogLevel.debug);
    const namedLogger = createLogger('logger name');

    namedLogger.debug('debug');
    namedLogger.info('info');
    namedLogger.error('error');
    namedLogger.warn('warn');

    expect(consoleMock).toMatchSnapshot();
  });
});
