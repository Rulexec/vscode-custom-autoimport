export { readConfig };

/*
	Returns list:

		[{
			suggestion: "suggestion",
			description: 'import some from 'another',
			defaultExportName: 'some',
			modulePath: 'another',
		}, {
			suggestion: "suggestion2",
			description: 'import { some as awesome } from 'another',
			exportName: 'some',
			alias: 'awesome',
			modulePath: 'another',
		}]
*/
function readConfig(config) {
	let { imports } = config;

	let result = [];

	if (!imports) {
		return result;
	}

	for (let [key, modulePath] of Object.entries(imports)) {
		let suggestion = key;
		let importPart = key;
		let defaultExportName = key;
		let exportName = null;
		let alias = null;

		let match = /^\s*{\s*([^\s]+)(?:\s+as\s+([^\s]+))?\s*}\s*$/.exec(key);
		if (match) {
			let [, _exportName, _alias] = match;
			suggestion = _alias || _exportName;
			importPart = `{ ${_exportName}${_alias ? ` as ${_alias}` : ''} }`;
			defaultExportName = null;
			exportName = _exportName;
			alias = _alias || null;
		}

		result.push({
			suggestion,
			description: `import ${importPart} from '${modulePath}'`,
			defaultExportName,
			exportName,
			alias,
			modulePath,
		});
	}

	return result;
}
