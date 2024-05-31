// webpack.config.js
module.exports = {
    // ... your existing configuration ...
    module: {
      rules: [
        // ... your existing rules ...
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]',
                outputPath: 'images',
                publicPath: '/',
              },
            },
          ],
        },
      ],
    },
  };