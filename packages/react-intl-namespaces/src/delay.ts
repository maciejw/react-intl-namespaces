export interface Cancelable {
  cancel: () => void;
}

export class CancelablePromise<T> implements Promise<T>, Cancelable {
  public [Symbol.toStringTag]: 'Promise';
  private promise: Promise<T>;
  constructor(
    executor: (
      resolve: (value?: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
    ) => void,
    public cancel: () => void,
  ) {
    this.promise = new Promise(executor);
  }

  public then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined,
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }
  public catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | null
      | undefined,
  ): Promise<T | TResult> {
    return this.promise.catch(onrejected);
  }
}

export function delay(timeout: number = 0): Promise<void> & Cancelable {
  let timeoutHandle = 0;

  const p = new CancelablePromise<void>(
    resolve => {
      timeoutHandle = window.setTimeout(resolve, timeout);
    },
    () => window.clearTimeout(timeoutHandle),
  );

  return p;
}
