const typescript = require('typescript');
const tsconfig = require('./tsconfig.test.json');
const identityObjectProxy = require('identity-obj-proxy');

module.exports = function(wallaby) {
  return {
    files: [
      'packages/**/package.json',
      'packages/**/*.ts?(x)',
      'packages/**/*.css',
      '!packages/**/*.test.ts?(x)',
    ],
    tests: ['packages/**/*.test.ts?(x)'],
    debug: true,
    testFramework: 'jest',
    env: {
      type: 'node',
    },
    setup: w => {
      let jestConfig = global._modifiedJestConfig;
      if (!jestConfig) {
        jestConfig = global._modifiedJestConfig = require('./package.json').jest;
        const path = require('path');
        const globby = require('globby');

        const originalModuleNameMapper = jestConfig.moduleNameMapper;

        jestConfig.moduleNameMapper = globby
          .sync(path.join(w.projectCacheDir, 'packages/*/package.json'))
          .reduce((acc, v) => {
            const packageJsonPath = v;
            acc['^' + require(packageJsonPath).name] = path.dirname(
              packageJsonPath,
            );
            return acc;
          }, {});

        jestConfig.moduleNameMapper = {
          ...jestConfig.moduleNameMapper,
          ...originalModuleNameMapper,
        };
      }

      wallaby.testFramework.configure(jestConfig);
    },
    compilers: {
      'packages/**/*.ts?(x)': wallaby.compilers.typeScript(
        tsconfig.compilerOptions,
      ),
    },
  };
};
