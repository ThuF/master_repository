/* globals $ */
/* eslint-env node, dirigible */

exports.getObject = function(name) {
	return {
		'metadata': {
			'name': name
		}
	};
};
