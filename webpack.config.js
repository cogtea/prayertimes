const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RtlCssPlugin = require('rtlcss-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { VueLoaderPlugin } = require('vue-loader');

var pathsToClean = [
  'dist',
];
var cleanOptions = {
  exclude:  [],
  verbose:  true,
  dry:      false
};

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './render/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '../../'
  },
  module: {
     rules: [
       { test: /\.css$/, use: [ process.env.NODE_ENV !== 'production'? 'vue-style-loader': MiniCssExtractPlugin.loader,'css-loader']},
       { test: /\.less$/,use: [process.env.NODE_ENV !== 'production'? 'vue-style-loader': MiniCssExtractPlugin.loader,'css-loader','less-loader']},
			 { test: /\.vue$/, loader: 'vue-loader', options: { loaders: {} /* other vue-loader options go here */}},
       { test: /\.(png|jpg|gif|svg)$/, type: 'asset/resource', generator: { filename: 'assets/imgs/[name][ext]' }},
       { test: /\.mp3$/, type: 'asset/resource', generator: { filename: 'assets/sound/[name][ext]' }},
       { test: /\.(woff|woff2|eot|ttf|svg)$/, type: 'asset/resource', generator: { filename: 'assets/fonts/[name][ext]' }}
     ]
  },
  plugins: [
      new CleanWebpackPlugin(pathsToClean, cleanOptions),
      new CopyWebpackPlugin({
      patterns: [
            { from: 'main', to: 'main' },
            { from: 'assets/icons', to: 'assets/icons'}
        ]
      }),
      new HtmlWebpackPlugin({template: './render/layouts/app.html', filename: 'render/layouts/app.html'}),
      new MiniCssExtractPlugin({
          filename: 'assets/css/[name].ltr.css',
        }),
      new RtlCssPlugin('assets/css/[name].rtl.css'),
      new Dotenv({
        systemvars: true,
      }),
      new VueLoaderPlugin()
  ],
  performance: {
    hints: 'warning'
  },
  target: "electron-renderer",
  mode: process.env.NODE_ENV !== 'development' ? 'production' : 'development'
};
