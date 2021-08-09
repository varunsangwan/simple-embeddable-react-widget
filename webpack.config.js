const path = require("path");
const webpack = require("webpack");
var copyWebpackPlugin = require("copy-webpack-plugin");
const bundleOutputDir = "./dist";

module.exports = (env) => {
  const isProductionBuild = env && env.production;

  return [
    {
      entry: ["@babel/polyfill", "./src/main.js"],
      mode: "production",
      output: {
        //filename: "widget.js",
        filename: "index.js",
        path: path.resolve(bundleOutputDir),
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ["babel-loader"],
          },
          {
            test: /\.css$/i,
            include: [
              path.resolve(__dirname, "node_modules"),
              path.resolve(__dirname, "src"),
            ],
            loaders: ["style-loader", "css-loader"],
          },
          {
            test: /\.(woff|woff2|eot|ttf)$/,
            use: ["url-loader?limit=100000"],
          },
          { test: /\.png$/, use: "url-loader?mimetype=image/png" },
          {
            test: /\.svg$/,
            use: [
              {
                loader: "svg-url-loader",
                options: {
                  limit: 10000,
                },
              },
            ],
          },
        ],
      },
      devServer: {
        port: 3000,
        contentBase: bundleOutputDir,
      },
      //remove
      // plugins: [
      //   new copyWebpackPlugin({
      //     patterns: [{ from: "demo/", to: "index.html" }],
      //   }),
      // ],
    },
  ];
};
