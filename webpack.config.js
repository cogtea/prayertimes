const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RtlCssPlugin = require('rtlcss-webpack-plugin');

var pathsToClean = [
  'dist',
];

// the clean options to use
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
    publicPath: path.resolve(__dirname, 'dist') + '/'
  },
  module: {
     rules: [
       { test: /\.css$/, use: [ process.env.NODE_ENV !== 'production'? 'vue-style-loader': MiniCssExtractPlugin.loader,'css-loader']},
       {test: /\.less$/,use: [process.env.NODE_ENV !== 'production'? 'vue-style-loader': MiniCssExtractPlugin.loader,'css-loader','less-loader']},
       { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
			 { test: /\.vue$/, loader: 'vue-loader', options: { loaders: {} /* other vue-loader options go here */}},
       { test: /\.(png|jpg|gif|svg)$/, loader: 'file-loader', options: { name: '[name].[ext]' , outputPath: 'assets/imgs/', publicPath: '../../assets/imgs/'}},
       { test: /\.mp3$/, loader: 'file-loader', options: { name: '[name].[ext]' , outputPath: 'assets/sound/', publicPath: '../../assets/sound/'}},
       { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
     ]
  },
  plugins: [
      new CleanWebpackPlugin(pathsToClean, cleanOptions),
      new CopyWebpackPlugin([
            { from: 'main', to: 'main' },
            { from: 'assets/icons', to: 'assets/icons'}
        ]),
      new HtmlWebpackPlugin({template: './render/layouts/app.html', filename: 'render/layouts/app.html'}),
      new MiniCssExtractPlugin({
          filename: 'assets/css/[name].ltr.css',
        }),
      new RtlCssPlugin('assets/css/[name].rtl.css')
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  performance: {
    hints: false
  },
  target: "electron-renderer",
  mode: process.env.NODE_ENV
};
