const base = require('./webpack.dev.base.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  ...base,
  entry: { builder: './src/builder.tsx' },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/builder.html',
      filename: './builder.html',
    }),
  ],
};

