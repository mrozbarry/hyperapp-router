import { eslint } from 'rollup-plugin-eslint';
import { terser } from 'rollup-plugin-terser';
import strip from '@rollup/plugin-strip';
import cleanup from 'rollup-plugin-cleanup';

export default {
  input: './src/index.js',
  plugins: [
    eslint(),
    terser({
      module: true,
    }),
    strip(),
    cleanup(),
  ],
  output: {
    name: 'withRouter',
    file: 'index.js',
    format: 'umd',
    exports: 'named',
  },
};
