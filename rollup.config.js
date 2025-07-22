import { terser } from 'rollup-plugin-terser';
// node_modules を取り込む場合は要る
// import { nodeResolve } from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'dist/index.js',
  output: {
    file: 'bundle/bundle.js',
    sourcemap: false,
    compact: true,
    // prepend shebang in bundle.js (requirement for npx cli tool)
    banner: '#!/usr/bin/env node',
    // esm や cjs だとグローバル識別子が他のコードから参照される可能性があると判断される
    // iife（Immediately Invoked Function Expression）ならすべて自己完結とみなされ、容赦なく関数名も短縮・難読化される
    format: 'esm',
  },
  // iife format で書き出す場合は external を空にしないとエラー
  // external: [],
  external: id => /node_modules/.test(id), // node_modules は外部化
  // node_modules をすべて取り込む場合は commonjs/nodeResolve が要る
  plugins: [
    // commonjs(),
    // nodeResolve({
    //   browser: false,
    //   preferBuiltins: true,
    // }),
    terser({
      mangle: {
        toplevel: true // トップレベルの識別子も難読化
      },
      compress: {
        passes: 3, // 複数回圧縮
        drop_console: true,
        pure_funcs: ['console.info', 'console.debug', 'console.warn'],
      },
      format: {
        comments: false
      },
      module: true,
      toplevel: true,
    }),
  ],
};
