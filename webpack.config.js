const path = require("path")

module.exports = {
  entry: {
    'student': [path.resolve(__dirname, 'src/student/App.jsx')],
  },
  output: {
    path: path.resolve(__dirname, 'static/js'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.jsx$/,
      use: [{ loader: 'babel-loader',
              options: { 
                presets: ['@babel/preset-react'],
                plugins: ['@babel/plugin-proposal-class-properties']
              }
           }]
    }]
  },
  devtool: 'source-map',
	optimization: {
    splitChunks: {
      chunks: 'all',
    },
	}
}

