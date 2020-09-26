const path = require('path');

let config = {
	mode: 'production',
	target: 'node',
	entry: {
		extension: path.resolve(__dirname, 'src/extension.js'),
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'out'),
	},
	module: {
		noParse: /\/vscode.js$/,
	},
	devtool: 'source-map',
};

module.exports = config;
