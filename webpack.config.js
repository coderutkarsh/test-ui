module.exports = {
  port:8000,
    devtool:'source-map',
  entry: ['./src/index.js'],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-1']
        }
      },
      {
        loader: require.resolve('css-loader'),
        options: {
            modules: true, //must add this
            importLoaders: 1,
            minimize: true,
            sourceMap: shouldUseSourceMap,
        },
    }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    port:3080
  }
};
