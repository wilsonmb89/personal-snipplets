const path = require('path');

module.exports = {
  entry: {
    index: {
      filename: 'index.js',
      import: './src/index.ts',
      library: {
        type: 'umd'
      }
    }
  },
  output: {
    path: path.resolve(__dirname, '../build')
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript', '@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  }
};
