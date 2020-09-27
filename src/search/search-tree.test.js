import { expect } from 'Chai';
import { SearchTree, _getTrigrams } from './search-tree.js';

describe('SearchTree', () => {
	it('should match suggestions by partial matching', () => {
		let searchTree = new SearchTree();

		searchTree.add('somephrase', {
			name: 'abracadabra',
		});
		searchTree.add('anotherphrase', {
			name: 'abracadabra2',
		});

		// TODO: ensure suggestions priority?
		expect(searchTree.find('some')).to.deep.equalInAnyOrder([
			{
				name: 'abracadabra',
			},
		]);
		expect(searchTree.find('another')).to.deep.equalInAnyOrder([
			{
				name: 'abracadabra2',
			},
		]);
		expect(searchTree.find('erphra')).to.deep.equalInAnyOrder([
			{
				name: 'abracadabra2',
			},
			{
				name: 'abracadabra',
			},
		]);
	});

	it('should split words to trigrams', () => {
		expect(getTrigrams('test')).to.deep.equalInAnyOrder(['tes', 'est']);
		expect(getTrigrams('12345')).to.deep.equalInAnyOrder([
			'123',
			'234',
			'345',
		]);

		function getTrigrams(word) {
			return Array.from(_getTrigrams(word));
		}
	});
});
