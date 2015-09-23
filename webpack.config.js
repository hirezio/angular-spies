var path = require('path');

/* global __dirname */

var filename = './dist/angular-spies'
filename += process.env.MINIFY === "true" ? '.min' : '';
filename += '.js';

module.exports = {
	context: __dirname,
	entry: './src/index.js',
	output:{
		filename: filename
	},
	module:{
		devtool: 'inline-source-map',
	  loaders: [
	    {test: /\.js$/, loader: 'babel', exclude: '/node_modules/'}
	  ]
	}
}