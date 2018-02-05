module.exports = function follow(api, rootPath, relArray) {
	var root = api({
		method: 'GET',
		path: rootPath
	});

	return relArray.reduce(function(root, arrayItem) {
		var rel = typeof arrayItem === 'string' ? arrayItem : arrayItem.rel;
		return traverseNext(root, rel, arrayItem);
	}, root);

	function traverseNext (root, rel, arrayItem) {
		return root.then(function (response) {
			if (hasEmbeddedRel(response.entity, rel)) {
				return response.entity._embedded[rel];
			}

			if(!response.entity._links) {
				return [];
			}

            let relURL = rel in (response.entity._links) ? response.entity._links[rel].href : rel;
			if (typeof arrayItem === 'string') {
				return api({
					method: 'GET',
					path: relURL
				});
			} else {
				return api({
					method: 'GET',
					path: relURL,
					params: arrayItem.params
				});
			}
		});
	}

	function hasEmbeddedRel (entity, rel) {
		return entity._embedded && entity._embedded.hasOwnProperty(rel);
	}
};
