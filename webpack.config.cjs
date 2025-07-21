const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './dist/index.js',
  target: 'node',
  mode: 'production',
  externals: [nodeExternals()],
  output: {
    filename: 'bundle.cjs',
    path: path.resolve(__dirname, 'bundle'),
    library: {
      type: 'commonjs2'
    }
  }
};
