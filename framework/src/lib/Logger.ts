export class FakeLogger implements Logger {
  level = '';
  fatal() {
    //
  }
  error() {
    //
  }
  warn() {
    //
  }
  info() {
    //
  }
  debug() {
    //
  }
  trace() {
    //
  }
  silent() {
    //
  }
}

export interface Logger {
  level: string;
  fatal: LogFn;
  error: LogFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
  trace: LogFn;
  silent: LogFn;
}

export interface LogFn {
  // TODO: why is this different from `obj: object` or `obj: any`?
  /* tslint:disable:no-unnecessary-generics */
  <T extends object>(obj: T, msg?: string, ...args: any[]): void;
  (obj: unknown, msg?: string, ...args: any[]): void;
  (msg: string, ...args: any[]): void;
}
