const path = require('path');

module.exports = {
  mode: 'development',
  devtool: '#eval-source-map',
  entry: {
    'bundle': './src/index.js',
    'puzzle-worker': './src/puzzle-worker.js',
    'service-worker': './src/service-worker.js'
  },  
  output: {
    globalObject: 'this',
    path: path.resolve(__dirname, 'build/js')
  },
  devServer: {
    hot: true,
    https: false,
    publicPath: '/js/',
    contentBase: path.join(__dirname, 'public'),
    watchContentBase: true,
    stats:{
      children: false,
      maxModules: 0
    }
  }
};