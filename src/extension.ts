import * as vscode from 'vscode';
import { parseImports } from './util/parse-imports';

// TODO: extract prefix tree to separate class
const PREFIX_TREE_VALUE = Symbol('prefixTreeValue');

// TODO: extract {Types} to named types

export function activate(context: vscode.ExtensionContext) {
	let tree: Map<string | Symbol, any>;

	updateTree();

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((event) => {
			if (event.affectsConfiguration('customAutoImport')) {
				updateTree();
			}
		}),
	);

	function updateTree() {
		let imports = vscode.workspace
			.getConfiguration('customAutoImport')
			.get<any>('imports', {});

		tree = buildPrefixTree<String>(parseImportsSetting(imports));
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

				let text = document.getText(range).toLowerCase();

				let chars = text.split('');

				let suggestions: Array<{ key: string; value: string }> = [];

				let treeNode = tree;

				chars.some((c) => {
					treeNode = treeNode.get(c);
					if (!treeNode) {
						return true;
					}
				});

				if (treeNode) {
					addAllSuggestions(treeNode);
				}

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

				function addAllSuggestions(map: Map<string | Symbol, any>) {
					map.forEach((mapOrValue, key) => {
						if (key === PREFIX_TREE_VALUE) {
							suggestions.push(mapOrValue);
						} else {
							addAllSuggestions(mapOrValue);
						}
					});
				}

				let result: Array<vscode.CompletionItem> = [];

				suggestions.forEach(({ key, value }) => {
					let importsList = parsedImports.get(value);

					let alreadyHas = importsList && importsList.some((importEntry) => {
						return importEntry.name === key;
					});

					if (alreadyHas) {
						return;
					}

					let importStr = `import ${key} from '${value}';`;

					let item = new vscode.CompletionItem(
						key,
						vscode.CompletionItemKind.Reference,
					);
					item.detail = importStr;
					item.additionalTextEdits = [
						vscode.TextEdit.insert(
							new vscode.Position(0, 0),
							importStr + '\n',
						),
					];

					result.push(item);
				});

				return result;
			},
		});

		context.subscriptions.push(disposable);
	});
}

export function deactivate() {}

function parseImportsSetting(
	imports: any,
): Iterable<{ key: String; value: String }> {
	let result: Array<{ key: String; value: String }> = [];

	for (let [key, value] of Object.entries(imports)) {
		if (typeof value !== 'string') {
			continue;
		}

		result.push({ key, value });
	}

	return result;
}

function buildPrefixTree<T>(items: Iterable<{ key: String; value: T }>) {
	let result = new Map();

	for (let { key, value } of items) {
		let lowerKey = key.toLowerCase();

		let map = lowerKey.split('').reduce((map, c) => {
			let newMap = map.get(c);
			if (!newMap) {
				newMap = new Map();
				map.set(c, newMap);
			}

			return newMap;
		}, result);

		map.set(PREFIX_TREE_VALUE, { key, value });
	}

	return result;
}
