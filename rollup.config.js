import eslint from '@rollup/plugin-eslint';
import { terser } from 'rollup-plugin-terser';
import strip from '@rollup/plugin-strip';
import cleanup from 'rollup-plugin-cleanup';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: './src/withRouter/index.js',
  plugins: [
    nodeResolve(),
    eslint(),
    terser(),
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
