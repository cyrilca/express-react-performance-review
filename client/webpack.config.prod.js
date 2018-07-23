const { resolve } = require('path')

const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'source-map',

  context: resolve(__dirname, 'src'),

  entry: [
    './index.jsx',
    './styles/main.scss'
  ],

  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name]-[hash].js',
    publicPath: ''
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'API_URL': JSON.stringify(process.env.API_URL)
      }
    }),
    new HtmlWebpackPlugin({ template: './index.html', inject: 'body' })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
      },
      {
        test: /\.(gif|svg|jpg|png)$/,
        loader: "file-loader"
      },
      {
        test: /\.scss|css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'resolve-url-loader',
          'sass-loader?sourceMap'
        ]
      }
    ]
  }
};