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
		let match = /^\s*{\s*([^}]+)\s*}\s*$/.exec(key);
		if (match) {
			let text = match[1];
			let regexp = /([^\s,]+)(?:\s+as\s+([^\s,]+))?,?\s*/g;

			while (true) {
				let match = regexp.exec(text);
				if (!match) {
					break;
				}

				let [, exportName, alias] = match;
				let suggestion = alias || exportName;
				let importPart = `{ ${exportName}${
					alias ? ` as ${alias}` : ''
				} }`;

				result.push({
					suggestion,
					description: `import ${importPart} from '${modulePath}'`,
					defaultExportName: null,
					exportName,
					alias: alias || null,
					modulePath,
				});
			}
		} else {
			result.push({
				suggestion: key,
				description: `import ${key} from '${modulePath}'`,
				defaultExportName: key,
				exportName: null,
				alias: null,
				modulePath,
			});
		}
	}

	return result;
}
