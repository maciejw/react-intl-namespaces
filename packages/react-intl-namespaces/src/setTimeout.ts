export const setTimeoutAsync = (ms: number) =>
  new Promise<void>(resolve => window.setTimeout(resolve, ms));
