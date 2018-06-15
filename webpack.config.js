const path = require('path')
const uglifyJs = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')

const dev = process.env.NODE_ENV === "dev"

let cssLoaders = [
  { loader: 'css-loader', options: { importLoaders: 1, minimize: !dev, url: true } },
]

if(!dev){
  cssLoaders.push({
    loader: 'postcss-loader',
    options: {
      plugins: (loader) => [
        require('autoprefixer')({
          browsers: ['last 2 versions', 'ie > 8']
        })
      ]
    }
  })
}

let config = {

  entry: {
    app: ['./src/assets/js/app.js', './src/assets/scss/global.sass']
  },

  watch: dev,

  output: {
    path: path.resolve('./dist/'),
    filename: 'assets/js/[name].js',
    publicPath: './'
  },
  devtool: dev ? 'cheap-module-eval-source-map' : false,
  devServer:{
    contentBase: path.resolve('./dist'),
    inline: true,
    hot: true
  },
  module:{

    rules: [
      {
        test: /\.js$/,
        use: ['eslint-loader','babel-loader']
      },
      {
        test: /\.css$/,
        use: cssLoaders
      },
      {
        test: /\.sass$/,
        use: [
            {
              loader:  MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../../'
              }
            },
          ...cssLoaders,
          'resolve-url-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/img/[name].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75
              }
            }
          }
        ]
      },
    ]

  },

  plugins:[
    new MiniCssExtractPlugin({
      filename: './assets/css/style.css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject : false
    })
  ]
}

if(!dev){
  config.plugins.push(new uglifyJs({sourceMap: false}))
}

module.exports = config;
