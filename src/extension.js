import vscode from './vscode.js';
import { parseImports } from './util/parse-imports.js';
import { SearchTree } from './search/search-tree.js';
import { readConfig } from './config/read-config.js';

exports.activate = function activate(context) {
	let searchTree = new SearchTree();

	updateTree();

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((event) => {
			if (event.affectsConfiguration('customAutoImport')) {
				updateTree();
			}
		}),
	);

	function updateTree() {
		let config = vscode.workspace.getConfiguration('customAutoImport');

		searchTree.reset();

		let suggestions = readConfig(config);

		suggestions.forEach((x) => {
			searchTree.add(x.suggestion, x);
		});
	}

	let supportedLanguages = [
		'javascript',
		'javascriptreact',
		'typescript',
		'typescriptreact',
	];

	supportedLanguages.forEach((type) => {
		let disposable = vscode.languages.registerCompletionItemProvider(type, {
			provideCompletionItems(document, position) {
				let range = document.getWordRangeAtPosition(position);

				let text = document.getText(range);

				let suggestions = searchTree.find(text);

				let parsedImports = parseImports({
					getText(a, b) {
						let text = document.getText(
							new vscode.Range(
								new vscode.Position(a[0], a[1]),
								new vscode.Position(b[0], b[1]),
							),
						);

						return text;
					},
				});

				let result = [];

				suggestions.forEach((suggestion) => {
					let {
						description,
						defaultExportName,
						exportName,
						alias,
						modulePath,
					} = suggestion;

					let importsList = parsedImports.get(modulePath);

					let alreadyHas =
						importsList &&
						importsList.some((importEntry) => {
							if (importEntry.fromModule !== modulePath) {
								return false;
							}

							return (
								(defaultExportName &&
									importEntry.name === defaultExportName) ||
								(importEntry.multipleImports &&
									importEntry.multipleImports.has(exportName))
							);
						});

					if (alreadyHas) {
						return;
					}

					let item = new vscode.CompletionItem(
						alias || exportName || defaultExportName,
						vscode.CompletionItemKind.Reference,
					);
					item.detail = description;
					item.additionalTextEdits = [
						vscode.TextEdit.insert(
							new vscode.Position(0, 0),
							description + ';\n',
						),
					];

					result.push(item);
				});

				return result;
			},
		});

		context.subscriptions.push(disposable);
	});
};

exports.deactivate = function deactivate() {};
