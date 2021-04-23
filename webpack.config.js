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
        filename: "widget.js",
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
            exclude: /node_modules/,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  modules: true,
                },
              },
            ],
          },
          { test: /\.png$/, use: "url-loader?mimetype=image/png" },
        ],
      },
      devServer: {
        port: 3000,
        contentBase: bundleOutputDir,
      },
      plugins: [
        new copyWebpackPlugin({
          patterns: [{ from: "demo/", to: "index.html" }],
        }),
      ],
    },
  ];
};
