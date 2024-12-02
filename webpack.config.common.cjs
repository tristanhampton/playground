// Reference: https://medium.com/@stowball/creating-a-production-ready-eleventy-project-with-webpack-babel-and-sass-89a740886092
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  entry: './webpack.entry.js',
  output: {
    // The global variable name any `exports` from `index.js` will be available at
    library: 'SITE',
    // Where webpack will compile the assets
    path: path.resolve(__dirname, './_dist'),
  },
  module: {
    rules: [
      {
        // Setting up compiling our Sass
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                outputStyle: 'expanded',
              },
            },
          },
        ],
      },
    ],
  },
  // Any `import`s from `node_modules` will compiled in to a `vendor.js` file.
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};