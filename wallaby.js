const typescript = require('typescript');
const tsconfig = require('./tsconfig.wallaby.json');

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
      'packages/**/*.ts?(x)': wallaby.compilers.typeScript(
        tsconfig.compilerOptions,
      ),
    },
  };
};
