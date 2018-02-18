export interface Logger {
  error(...params: any[]): void;
  warn(...params: any[]): void;
  info(...params: any[]): void;
  debug(...params: any[]): void;
}
export const dummyConsole = {
  debug: () => {
    return;
  },
  error: () => {
    return;
  },
  info: () => {
    return;
  },
  warn: () => {
    return;
  },
};
// tslint:disable:no-bitwise
// prettier-ignore
export enum LogLevel {
  none  =   0,
  error =   1 << 0,
  warn  =  (1 << 1) | error,
  info  =  (1 << 2) | warn,
  debug =  (1 << 3) | info,
}

let { error, info, warn, debug } = window.console || dummyConsole;

debug = debug.bind(window.console);
error = error.bind(window.console);
info = info.bind(window.console);
warn = warn.bind(window.console);

class ConsoleLogger implements Logger {
  constructor(private name?: string) {}

  public error(...params: any[]): void {
    if ((Logger.logLevel & LogLevel.error) === LogLevel.error) {
      this.log(error, ...params);
    }
  }
  public warn(...params: any[]): void {
    if ((Logger.logLevel & LogLevel.warn) === LogLevel.warn) {
      this.log(warn, ...params);
    }
  }
  public info(...params: any[]): void {
    if ((Logger.logLevel & LogLevel.info) === LogLevel.info) {
      this.log(info, ...params);
    }
  }
  public debug(...params: any[]): void {
    if ((Logger.logLevel & LogLevel.debug) === LogLevel.debug) {
      this.log(debug, ...params);
    }
  }
  private log(log: (...params: any[]) => void, ...params: any[]) {
    const name = this.getLoggerName();
    if (name) {
      log(...[name, ...params]);
    } else {
      log(...params);
    }
  }
  private getLoggerName() {
    if (this.name) {
      return `[${this.name}]`;
    }
    return;
  }
}

namespace Logger {
  export let logger: Logger = new ConsoleLogger();
  export let logLevel = LogLevel.none;
}

export function setLogLevel(level: LogLevel) {
  Logger.logLevel = level;
}

export function mockConsole(console: Console) {
  info = console.info;
  debug = console.debug;
  warn = console.warn;
  error = console.error;
}

function createLogger(name: string): Logger {
  return new ConsoleLogger(name);
}
const { logger } = Logger;

export { logger, createLogger };
