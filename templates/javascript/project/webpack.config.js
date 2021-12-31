const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    'static': {
      directory: './dist'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html')
    })
  ]
}

module.exports = config