import * as assert from 'assert';
import { parseImports } from './parse-imports';

describe('parseImports', () => {
	it('should parse simple import', () => {
		parseTestHelper(`import nameA from 'moduleA';`, {
			moduleA: [
				{
					name: 'nameA',
					alias: null,
					multipleImports: null,
					fromModule: 'moduleA',
					end: [0, 28],
				},
			],
		});
	});

	it('should parse multiple simple imports', () => {
		const text = `import nameA from 'moduleA';\nimport nameC from 'moduleB';`;

		parseTestHelper(text, {
			moduleA: [
				{
					name: 'nameA',
					alias: null,
					multipleImports: null,
					fromModule: 'moduleA',
					end: [0, 28],
				},
			],
			moduleB: [
				{
					name: 'nameC',
					alias: null,
					multipleImports: null,
					fromModule: 'moduleB',
					end: [1, 28],
				},
			],
		});
	});

	it('should parse simple multiple import with single item', () => {
		parseTestHelper(`import { nameB } from 'moduleB';`, {
			moduleB: [
				{
					name: null,
					alias: null,
					multipleImports: {
						nameB: {
							name: 'nameB',
							alias: null,
							end: [0, 14],
							withComma: false,
						},
					},
					fromModule: 'moduleB',
					end: [0, 32],
				},
			],
		});
	});
	it('should parse simple multiple import with multiple items', () => {
		parseTestHelper(`import { nameB, nameC } from 'moduleB';`, {
			moduleB: [
				{
					name: null,
					alias: null,
					multipleImports: {
						nameB: {
							name: 'nameB',
							alias: null,
							end: [0, 15],
							withComma: true,
						},
						nameC: {
							name: 'nameC',
							alias: null,
							end: [0, 21],
							withComma: false,
						},
					},
					fromModule: 'moduleB',
					end: [0, 39],
				},
			],
		});
	});

	it('should parse complex multiple import', () => {
		parseTestHelper(
			`import { nameA, nameB as nameC, nameD as nameE } from 'moduleA';`,
			{
				moduleA: [
					{
						name: null,
						alias: null,
						multipleImports: {
							nameA: {
								name: 'nameA',
								alias: null,
								end: [0, 15],
								withComma: true,
							},
							nameB: {
								name: 'nameB',
								alias: 'nameC',
								end: [0, 31],
								withComma: true,
							},
							nameD: {
								name: 'nameD',
								alias: 'nameE',
								end: [0, 46],
								withComma: false,
							},
						},
						fromModule: 'moduleA',
						end: [0, 64],
					},
				],
			},
		);
	});

	it('should parse star import', () => {
		parseTestHelper(`import * from 'moduleA';`, {
			moduleA: [
				{
					name: '*',
					alias: null,
					multipleImports: null,
					fromModule: 'moduleA',
					end: [0, 24],
				},
			],
		});
	});

	it('should parse alias import', () => {
		parseTestHelper(`import * as nameA from 'moduleA';`, {
			moduleA: [
				{
					name: '*',
					alias: 'nameA',
					multipleImports: null,
					fromModule: 'moduleA',
					end: [0, 33],
				},
			],
		});
	});

	it('should parse multiple multiline import', () => {
		parseTestHelper(`import\n{ nameB } from 'moduleB';`, {
			moduleB: [
				{
					name: null,
					alias: null,
					multipleImports: {
						nameB: {
							name: 'nameB',
							alias: null,
							end: [1, 7],
							withComma: false,
						},
					},
					fromModule: 'moduleB',
					end: [1, 25],
				},
			],
		});
	});

	it('should parse multiline import', () => {
		parseTestHelper(
			`import {\n  nameA,  nameB as nameC,\n  nameD\nas nameE,\n} from 'moduleA';`,
			{
				moduleA: [
					{
						name: null,
						alias: null,
						multipleImports: {
							nameA: {
								name: 'nameA',
								alias: null,
								end: [1, 8],
								withComma: true,
							},
							nameB: {
								name: 'nameB',
								alias: 'nameC',
								end: [1, 25],
								withComma: true,
							},
							nameD: {
								name: 'nameD',
								alias: 'nameE',
								end: [3, 9],
								withComma: true,
							},
						},
						fromModule: 'moduleA',
						end: [4, 17],
					},
				],
			},
		);
	});
});

function parseTestHelper(str: string, expected: any) {
	let imports = parseImports({
		getText() {
			return str;
		},
	});

	imports.forEach((importEntries) => {
		importEntries.forEach((entry) => {
			// @ts-ignore
			entry.multipleImports = mapToObject(entry.multipleImports);
		});
	});
	// @ts-ignore
	imports = mapToObject(imports);

	assert.deepStrictEqual(imports, expected);
}

// @ts-ignore
function mapToObject(map) {
	if (!map) {
		return null;
	}

	let obj = {};

	// @ts-ignore
	map.forEach((value, key) => {
		// @ts-ignore
		obj[key] = value;
	});

	return obj;
}
