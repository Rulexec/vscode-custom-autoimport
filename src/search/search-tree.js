export { SearchTree };

function SearchTree() {
	let tree = new Map();

	this.add = function (key, data) {
		key = key.toLowerCase();

		for (let two of getFirstTwoCharacters(key)) {
			addSuggestion(two, data);
		}
		for (let tri of getTrigrams(key)) {
			addSuggestion(tri, data);
		}

		function addSuggestion(tri, data) {
			let arr = tree.get(tri);
			if (!arr) {
				arr = [];
				tree.set(tri, arr);
			}

			arr.push({ key, data });
		}
	};

	this.find = function (text) {
		text = text.toLowerCase();

		let suggestions = new Map();

		for (let two of getFirstTwoCharacters(text)) {
			addVariants(two);
		}
		for (let tri of getTrigrams(text)) {
			addVariants(tri);
		}

		function addVariants(tri) {
			let arr = tree.get(tri);
			if (!arr) {
				return;
			}

			arr.forEach(({ key, data }) => {
				let variant = suggestions.get(key);
				if (!variant) {
					variant = {
						key,
						tri,
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

		return list.map((x) => x.data);
	};

	this.reset = function () {
		tree = new Map();
	};
}

function* getFirstTwoCharacters(text) {
	if (text.length >= 1) {
		yield text[0];

		if (text.length >= 2) {
			yield text.slice(0, 2);
		}
	}
}

export { getTrigrams as _getTrigrams };
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
