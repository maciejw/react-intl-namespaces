/** @internal */
function invariant(condition: boolean, format: string, ...params: string[]) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    let error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
          'for the full error message and additional helpful warnings.',
      );
    } else {
      const args = params;
      let argIndex = 0;
      error = new Error(
        format.replace(/%s/g, () => {
          return args[argIndex++];
        }),
      );
      error.name = 'Invariant Violation';
    }

    throw error;
  }
}

export { invariant };
