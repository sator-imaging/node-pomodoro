import path from 'path';
import { terser } from 'rollup-plugin-terser';
// node_modules を取り込む場合は要る
// import { nodeResolve } from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'dist/index.js',
  output: {
    file: 'bundle/bundle.js',
    format: 'esm',
    sourcemap: false,
    compact: true,
  },
  external: id => /node_modules/.test(id), // node_modules は外部化
  // external: [],
  plugins: [
    terser({
      format: { comments: false },
      compress: {
        passes: 3,
        drop_console: true,
        pure_funcs: ['console.info', 'console.debug', 'console.warn'],
      },
      mangle: true,
      module: true,
      toplevel: true,
    }),
    // node_modules を取り込む場合は要る
    // commonjs(),
    // nodeResolve({
    //   browser: false,
    //   preferBuiltins: true,
    // }),
  ],
};
