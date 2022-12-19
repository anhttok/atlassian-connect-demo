var path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
    ],
  },
  watch: process.argv.indexOf('--no-watch') > -1 ? false : true,
  entry: {
    'dog.page': path.resolve('./src/Dog.tsx'),
  },
  output: {
    filename: 'bundled.[name].js',
    path: path.resolve('../backend/public/dist'),
  },
};
