var compilerOptions = require('./tsconfig.json');
compilerOptions.module = 'CommonJs';

compilerOptions.module = 'CommonJs';
compilerOptions.target = 'ES5'; // may also do this if required

module.exports = function(wallaby) {
  return {
    files: ['packages/**/*.ts?(x)', '!packages/**/*.test.ts?(x)'],
    tests: ['packages/**/*.test.ts?(x)'],
    debug: true,
    testFramework: 'jest',
    env: {
      type: 'node'
    },
    compilers: {
      'packages/**/*.ts?(x)': wallaby.compilers.typeScript(compilerOptions)
    },
    setup: function(wallaby) {
      const jestConfig = require('./package.json').jest;
      jestConfig.modulePaths = jestConfig.modulePaths.map(p => p.replace('<rootDir>', wallaby.projectCacheDir));
      wallaby.testFramework.configure(jestConfig);
    }
  };
};
