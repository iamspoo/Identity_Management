const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './src/index.html', to: "index.html" },
      { from: './src/signup.html', to: "signup.html" },
	    { from: './src/main.html', to: "main.html" },
	    { from: './src/css/style3.css', to: "style3.css" },
		{ from: './src/images/background.jpeg', to: "background.jpeg" },
		{ from: './src/orgmain.html', to: "orgmain.html" },
		{ from: './src/idimg.html', to: "idimg.html" },
		{ from: './src/images/image1.jpg', to: "image1.jpg" },
		{ from: './src/images/image2.jpg', to: "image2.jpg" },
		{ from: './src/images/image3.jpg', to: "image3.jpg" },
    ])
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}