const _path = require('path');
const packageJson = require('./package.json')

let config = {
	mode: 'production',
	target: 'node',
	entry: {
		extension: _path.resolve(__dirname, 'src/extension.js'),
	},
	output: {
		filename: '[name].js',
		path: _path.resolve(__dirname, 'out'),
	},
	resolve: {
		alias: packageJson._moduleAliases || {},
	},
	module: {
		noParse: /\/vscode.js$/,
	},
	devtool: 'source-map',
};

module.exports = config;
