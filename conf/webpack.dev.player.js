const base = require('./webpack.dev.base.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  ...base,
  entry: { player: './src/app.tsx' },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/player.html',
      filename: './player.html',
    }),
  ],
};

