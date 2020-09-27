import chai from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import { readConfig } from './read-config.js';

chai.use(deepEqualInAnyOrder);
const { expect } = chai;

describe('readConfig', () => {
	it('should parse old format default imports', () => {
		let config = {
			imports: {
				defaultExportName: 'modulePath',
				another: 'another/module/path',
			},
		};

		let parsed = readConfig(config);

		expect(parsed).to.deep.equalInAnyOrder([
			{
				suggestion: 'defaultExportName',
				description: `import defaultExportName from 'modulePath'`,
				defaultExportName: 'defaultExportName',
				exportName: null,
				alias: null,
				modulePath: 'modulePath',
			},
			{
				suggestion: 'another',
				description: `import another from 'another/module/path'`,
				defaultExportName: 'another',
				exportName: null,
				alias: null,
				modulePath: 'another/module/path',
			},
		]);
	});

	it('should parse new format with modules definitions', () => {
		let config = {
			modules: [
				{
					name: 'test-module',
					defaultExport: 'testMod',
					exports: ['testFun', { name: 'testFun2', alias: 'asFun2' }],
				},
				{
					name: 'test-module2',
					defaultExport: 'testMod2',
				},
			],
		};

		let parsed = readConfig(config);

		expect(parsed).to.deep.equalInAnyOrder([
			{
				suggestion: 'testMod',
				description: `import testMod from 'test-module'`,
				defaultExportName: 'testMod',
				exportName: null,
				alias: null,
				modulePath: 'test-module',
			},
			{
				suggestion: 'testFun',
				description: `import { testFun } from 'test-module'`,
				defaultExportName: null,
				exportName: 'testFun',
				alias: null,
				modulePath: 'test-module',
			},
			{
				suggestion: 'asFun2',
				description: `import { testFun2 as asFun2 } from 'test-module'`,
				defaultExportName: null,
				exportName: 'testFun2',
				alias: 'asFun2',
				modulePath: 'test-module',
			},
			{
				suggestion: 'testMod2',
				description: `import testMod2 from 'test-module2'`,
				defaultExportName: 'testMod2',
				exportName: null,
				alias: null,
				modulePath: 'test-module2',
			},
		]);
	});
});
