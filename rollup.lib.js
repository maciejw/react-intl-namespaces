import path from 'path';
// import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript';
import postcss from 'rollup-plugin-postcss';
const ts = require('typescript');
//const postcss = require('postcss');
const modules = require('postcss-modules');

const copyright = `/*
 * Copyright ${new Date().getFullYear()}, warszawski.pro
 * Copyrights licensed under the MIT License
 * See the accompanying LICENSE file for terms.
 */
`;
const cssExportMap = {};

function rollupConfig(packageBasePath) {
  const pkg = require(path.resolve(packageBasePath, 'package.json'));
  const plugins = [
    typescript({
      typescript: ts,
      tsconfig: 'tsconfig.types.json',
    }),
    postcss({
      modules: true,
      extensions: ['.css'],
      namedExports: true,
      plugins: [require('postcss-cssnext')],
    }),
  ];
  const external = Object.getOwnPropertyNames(pkg.peerDependencies);
  const banner = copyright;
  const input = path.resolve(packageBasePath, `index.ts`);
  const outputMain = path.resolve(packageBasePath, pkg.main);
  const outputModule = path.resolve(packageBasePath, pkg.module);

  return [
    {
      input,
      output: {
        file: outputMain,
        format: 'cjs',
        banner,
      },
      external,
      plugins,
    },
    {
      input,
      output: {
        file: outputModule,
        format: 'es',
        banner,
      },
      external,
      plugins,
    },
  ];
}

//const packages = [{ input: 'packages/react-intl-namespaces/index.ts' }];

export default [
  ...rollupConfig('packages/react-intl-namespaces'),
  ...rollupConfig('packages/react-intl-namespaces-locize-client'),
  ...rollupConfig('packages/react-intl-namespaces-locize-editor'),
];
