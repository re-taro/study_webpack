const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin    = require('html-webpack-plugin');
const CopyWebpackPlugin   = require('copy-webpack-plugin');
const ImageminPlugin     = require('imagemin-webpack-plugin').default;
const ImageminPngQuant = require('imagemin-pngquant');

const MODE = "development";

const sourceMapStatus = MODE === "development";

module.exports = {
  context: path.resolve(process.cwd(), 'src'),
  entry: ['./index.js', './sub1.js', './sub2.js'],
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: "bundle.js",
    clean: {
      keep: /index.html/,
    }
  },
  module: {
    rules:[
      {
        test: /\.(sass|scss|css)$/,
        use:[
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: true,
              sourceMap: sourceMapStatus,
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: sourceMapStatus
            }
          }
        ]
      },
      {
        test: /\.(png)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 100 * 1024,
          }
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), 'src/index.html'),
      filename: path.resolve(process.cwd(), 'dist/index.html'),
      inject: 'body'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(process.cwd(), 'src/img/'),
          to: path.resolve(process.cwd(), 'dist/img/'),
        }
      ]
    }),
    new ImageminPlugin({
      test: /\.(png)$/i,
      pngquant: {
        quality: '70-85'
      },
      plugins: [
        ImageminPngQuant({
          quality: 85,
          progressive: true
        })
      ],
    })
  ],
}