export { SearchTree };

function SearchTree() {
	let tree = new Map();

	this.add = function(key, data) {
		for (let tri of getTrigrams(key)) {
			let arr = tree.get(tri);
			if (!arr) {
				arr = [];
				tree.set(tri, arr);
			}

			arr.push({ key, data });
		}
	};

	this.find = function(text) {
		let suggestions = new Map();

		for (let tri of getTrigrams(text)) {
			let arr = tree.get(tri);
			if (!arr) {
				continue;
			}

			arr.forEach(({ key, data }) => {
				let variant = suggestions.get(key);
				if (!variant) {
					variant = {
						data,
						occurences: 0,
					};
					suggestions.set(key, variant);
				}

				variant.occurences++;
			});
		}

		let list = Array.from(suggestions.values());
		list.sort((a, b) => b.occurences - a.occurences);

		return list.map(x => x.data);
	};

	this.reset = function() {
		tree = new Map();
	};
}

export { getTrigrams as _getTrigrams }
function* getTrigrams(text) {
	let length = text.length;
	if (length <= 3) {
		yield text;
		return;
	}

	for (let i = 0; i < length - 2; i++) {
		yield text.slice(i, i + 3);
	}
}