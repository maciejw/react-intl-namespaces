module.exports = function(wallaby) {
  return {
    files: ['packages/**/*.ts?(x)', '!packages/**/*.test.ts?(x)'],
    tests: ['packages/**/*.test.ts?(x)'],
    debug: true,
    testFramework: 'jest',
    env: {
      type: 'node',
    },
    compilers: {
      'packages/**/*.ts?(x)': wallaby.compilers.typeScript({
        module: 'commonjs',
        target: 'es5',
      }),
    },
  };
};
