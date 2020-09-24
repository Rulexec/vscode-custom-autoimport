import { start } from 'repl';

export { parseImports };

type ModuleName = string;
type ModulePath = string;
type Position = [number, number];

interface TextDocument {
	getText: (start: Position, end: Position) => string;
}

type MultipleImportAlias = {
	name: ModuleName;
	alias: string | null;
	withComma: boolean;

	end: Position;
};
type Import = {
	name: ModuleName | null;
	alias: string | null;
	multipleImports: Map<ModuleName, MultipleImportAlias> | null;
	fromModule: ModulePath;

	end: Position;
};

// TODO: implement more than 16 lines
function parseImports(document: TextDocument): Map<ModulePath, [Import]> {
	let text = document.getText([0, 0], [16, 0]);

	let map = new Map();

	let regexp = /((import\s+)([^]+?)(\s+from\s+['])([^']+)([']\s*;?))\s*/g;

	let match: any;
	while (true) {
		match = regexp.exec(text);
		if (!match) {
			break;
		}

		let [, _fullNoWs, _start, name, _from, fromModule, _end] = match;

		// TODO: cache counts
		let [line, lastLinePos] = countNewLines(
			text.slice(0, match.index + _fullNoWs.length),
		);

		let endPos =
			match.index +
			_start.length +
			name.length +
			_from.length +
			fromModule.length +
			_end.length -
			lastLinePos;

		let finalName: string | null = name;
		let alias = null;
		let finalMultipleImports = null;

		let multipleImports = parseMultipleImports(name);
		if (multipleImports) {
			finalName = null;
			let map = new Map();

			let [
				lineBeforeMultipleImport,
				lineBeforeMultipleImportPos,
			] = countNewLines(text.slice(0, _start.length));

			multipleImports.forEach(({ name, alias, end, withComma }: any) => {
				map.set(name, {
					name,
					alias,
					end: [
						lineBeforeMultipleImport + end[0],
						end[0] > 0
							? end[1]
							: _start.length -
							  lineBeforeMultipleImportPos +
							  //   (end[0] > 0 ? 0 : lineBeforeMultipleImport + _start.length) +
							  end[1],
					],
					// end: [
					// 	line,
					// 	match.index - lastLinePos + _start.length + end,
					// ],
					withComma,
				});
			});

			finalMultipleImports = map;
		} else {
			let match = /^\*(?:\s+as\s+([^\s]+))?$/.exec(name);
			if (match) {
				finalName = '*';
				alias = match[1] || null;
			}
		}

		let importObj = {
			name: finalName,
			alias,
			multipleImports: finalMultipleImports,
			fromModule,
			end: [line, endPos],
		};

		let imports = map.get(fromModule);
		if (!imports) {
			imports = [];
			map.set(fromModule, imports);
		}

		imports.push(importObj);
	}

	return map;
}

function parseMultipleImports(str: string): any {
	if (!/^{.+}$/s.test(str)) {
		return null;
	}

	str = str.slice(1, -1);

	let result = [];

	let regexp = /(\s*([^,\s]+)(?:\s+as\s+([^,\s]+))?)\s*(,?)/g;

	while (true) {
		let match = regexp.exec(str);
		if (!match) {
			break;
		}

		let [_full, _start, name, alias, withComma] = match;

		let [line, lastLinePos] = countNewLines(
			str.slice(0, match.index + _full.length),
		);

		let endPos =
			match.index +
			(withComma ? _full.length : _start.length) -
			lastLinePos +
			(line > 0 ? 0 : 1);

		result.push({
			name,
			alias: alias || null,
			// 1 is {
			end: [line, endPos],
			withComma: !!withComma,
		});
	}

	return result;
}

function countNewLines(str: string): [number, number] {
	let count = 0;
	let pos;
	let lastPos = 0;

	while (true) {
		pos = str.indexOf('\n', pos);
		if (pos < 0) {
			break;
		}

		count++;
		pos++;

		lastPos = pos;
	}

	return [count, lastPos];
}
