var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	context: __dirname + path.sep + 'src',
	entry: './index.ts',
	devtool: 'inline-source-map',
	devServer: { inline: true },
	output: {
		path: __dirname + path.sep + 'dist',
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
	},
	module: {
		loaders: [
			{ test: /\.tsx?$/, loader: 'ts-loader' },
			{ test: /\.css$/, loader: ExtractTextPlugin.extract("css-loader") },
			{ test: /\.svg$/, loader: 'file-loader?name=[hash].[ext]' },
			{ test: /\.png$/, loader: 'file-loader?name=[name].[ext]' },
			{ test: /\.ico$/, loader: 'file-loader?name=[name].[ext]' },
		]
	},
	plugins: [
		new ExtractTextPlugin("bundle.css"),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './index.template.html',
			hash: true,
			inject: true
		})
	],
	externals: {
		// require("jquery") is external and available
		//  on the global var jQuery
		"jquery": "jQuery",
		"bootstrap": "bootstrap",
		"leaflet": "L"
	}
};