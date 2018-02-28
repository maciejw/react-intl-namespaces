import path from 'path';
import pluginTypescript from 'rollup-plugin-typescript';
import pluginPostcss from 'rollup-plugin-postcss';
import postCssCssNext from 'postcss-cssnext';
import typescript from 'typescript';
import tsconfig from './tsconfig.lib.json';

const copyright = `/*
 * Copyright ${new Date().getFullYear()}, warszawski.pro
 * Copyrights licensed under the MIT License
 * See the accompanying LICENSE file for terms.
 */
`;
const cssExportMap = {};

const pluginTypescriptOptions = tsconfig.compilerOptions;
pluginTypescriptOptions.typescript = typescript;
pluginTypescriptOptions.tsconfig = false;

const pluginPostcssOptions = {
  modules: true,
  extensions: ['.css'],
  namedExports: true,
  plugins: [postCssCssNext],
};

function rollupConfig(packageBasePath) {
  const pkg = require(path.resolve(packageBasePath, 'package.json'));
  const plugins = [
    pluginTypescript(pluginTypescriptOptions),
    pluginPostcss(pluginPostcssOptions),
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
      treeshake: { pureExternalModules: ['tslib'] },
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

export default [
  ...rollupConfig('packages/react-intl-namespaces'),
  ...rollupConfig('packages/react-intl-namespaces-locize-client'),
  ...rollupConfig('packages/react-intl-namespaces-locize-editor'),
];
