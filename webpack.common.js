const webpack = require('webpack');
const path = require('path');
module.exports = {
  resolve: { extensions: ['.js', '.jsx'] },
  entry : path.resolve(__dirname,'src','app'),
  output: {
    path: path.resolve(__dirname,'./dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  // plugins: [
  //   new webpack.ContextReplacementPlugin(
  //     /graphql-language-service-interface[\\/]dist$/,
  //     new RegExp('^\\./.*\\.js$')
  //   ),
  // ],
  module: {
    rules: [
      {
        test : /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
      {
          test: /\.s?css$/,
          use: [
            {
              loader: "style-loader" // creates style nodes from JS strings
            },
            {
              loader: "css-loader" // translates CSS into CommonJS
            },
            {
              loader: "sass-loader" // compiles Sass to CSS
            }
          ]
      }
    ]
  }
};
