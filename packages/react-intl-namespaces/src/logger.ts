export interface Logger {
  error(message?: string, ...params: any[]): void;
  info(message?: string, ...params: any[]): void;
  debug(message?: string, ...params: any[]): void;
}
// tslint:disable:no-bitwise
export enum Level {
  error = 1 << 0,
  info = (1 << 1) | error,
  debug = (1 << 2) | info,
}
let currentConsole = window.console;

class ConsoleLogger implements Logger {
  constructor(private logLevel: Level) {}
  public error(message?: string, ...params: any[]): void {
    if ((this.logLevel & Level.error) === Level.error) {
      currentConsole.error(message, ...params);
    }
  }
  public info(message?: string, ...params: any[]): void {
    if ((this.logLevel & Level.info) === Level.info) {
      currentConsole.info(message, ...params);
    }
  }
  public debug(message?: string, ...params: any[]): void {
    if ((this.logLevel & Level.debug) === Level.debug) {
      currentConsole.debug(message, ...params);
    }
  }
}
class NullLogger implements Logger {
  public error(message?: string | undefined, ...params: any[]): void {
    return;
  }
  public info(message?: string | undefined, ...params: any[]): void {
    return;
  }
  public debug(message?: string | undefined, ...params: any[]): void {
    return;
  }
}
let logger: Logger = new NullLogger();

export function configureLogger(level: Level) {
  logger = new ConsoleLogger(level);
}
export function setConsole(console: Console) {
  currentConsole = console;
}
export { logger };
