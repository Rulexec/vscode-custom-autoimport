import chai from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import { readConfig } from './read-config.js';

chai.use(deepEqualInAnyOrder);
const { expect } = chai;

describe('readConfig', () => {
	it('should parse default imports', () => {
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

	it('should parse non-default imports', () => {
		let config = {
			imports: {
				'_': 'lodash',
				'{ flatMap }': 'lodash',
				'{ filter as _filter }': 'lodash',
			},
		};

		let parsed = readConfig(config);

		expect(parsed).to.deep.equalInAnyOrder([
			{
				suggestion: '_',
				description: `import _ from 'lodash'`,
				defaultExportName: '_',
				exportName: null,
				alias: null,
				modulePath: 'lodash',
			},
			{
				suggestion: 'flatMap',
				description: `import { flatMap } from 'lodash'`,
				defaultExportName: null,
				exportName: 'flatMap',
				alias: null,
				modulePath: 'lodash',
			},
			{
				suggestion: '_filter',
				description: `import { filter as _filter } from 'lodash'`,
				defaultExportName: null,
				exportName: 'filter',
				alias: '_filter',
				modulePath: 'lodash',
			},
		]);
	});

	it('should parse multiple non-default imports', () => {
		let config = {
			imports: {
				'{ flatMap, filter as _filter }': 'lodash',
			},
		};

		let parsed = readConfig(config);

		expect(parsed).to.deep.equalInAnyOrder([
			{
				suggestion: 'flatMap',
				description: `import { flatMap } from 'lodash'`,
				defaultExportName: null,
				exportName: 'flatMap',
				alias: null,
				modulePath: 'lodash',
			},
			{
				suggestion: '_filter',
				description: `import { filter as _filter } from 'lodash'`,
				defaultExportName: null,
				exportName: 'filter',
				alias: '_filter',
				modulePath: 'lodash',
			},
		]);
	});
});
