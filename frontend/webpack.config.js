const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { ProvidePlugin } = require('webpack');

module.exports = (env, options) => {
  console.info(`This is the Webpack 'mode': ${options.mode}`);
  return {
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
        {
          test: /\.(|s)[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            // 'css-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true,
                modules: {
                  localIdentName: '[local]', // '[name]_[local]__[hash:base64:5]',
                },
              },
            },
          ],
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          use: ['url-loader?limit=100000'],
        },
        {
          test: /\.json/,
          type: 'javascript/auto',
          use: [require.resolve('json-loader')],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        process: 'process/browser',
      },
    },
    devServer: { contentBase: path.join(__dirname, 'src') },
    watch: options.mode === 'development',
    entry: {
      'multiExcerpt.page': path.resolve('./src/pages/MultiExcerptPage.tsx'),
      'multiExcerptIncludeEditor.page': path.resolve(
        './src/pages/MultiExcerptIncludeEditorPage.tsx',
      ),
    },
    plugins: [
      new CleanWebpackPlugin(),
      new ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    output: {
      filename: 'bundled.[name].js',
      path: path.resolve('../backend/public/dist'),
    },
  };
};
