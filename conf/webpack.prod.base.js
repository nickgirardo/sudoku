const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  devtool: "inline-source-map",
  output: {
    // NOTE for some reason this dir seems to be based on the location of this file
    // all other paths seem to be based on the repo root
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: ["", ".js", ".ts", ".jsx", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  optimization: {
    minimize: true,
  },
};
