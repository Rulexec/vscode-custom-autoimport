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
	let { imports, modules } = config;

	let result = [];

	if (imports) {
		for (let [defaultExportName, modulePath] of Object.entries(imports)) {
			result.push({
				suggestion: defaultExportName,
				description: `import ${defaultExportName} from '${modulePath}'`,
				defaultExportName,
				exportName: null,
				alias: null,
				modulePath,
			});
		}
	}

	if (modules) {
		modules.forEach(mod => {
			if (!mod) {
				return;
			}

			let { name, defaultExport, exports } = mod;
			if (!isNonEmptyString(name)) {
				return;
			}

			if (isNonEmptyString(defaultExport)) {
				result.push({
					suggestion: defaultExport,
					description: `import ${defaultExport} from '${name}'`,
					defaultExportName: defaultExport,
					exportName: null,
					alias: null,
					modulePath: name,
				});
			}

			if (Array.isArray(exports)) {
				exports.forEach(exportDef => {
					if (!exportDef) {
						return;
					}

					if (isNonEmptyString(exportDef)) {
						result.push({
							suggestion: exportDef,
							description: `import { ${exportDef} } from '${name}'`,
							defaultExportName: null,
							exportName: exportDef,
							alias: null,
							modulePath: name,
						});
					} else {
						let { name: exportName, alias } = exportDef;
						let isValid = isNonEmptyString(exportName) && isNonEmptyString(alias);

						if (isValid) {
							result.push({
								suggestion: alias,
								description: `import { ${exportName} as ${alias} } from '${name}'`,
								defaultExportName: null,
								exportName: exportName,
								alias,
								modulePath: name,
							});
						}
					}
				});
			}
		});
	}

	return result;
}

function isNonEmptyString(str) {
	return str && typeof str === 'string';
}