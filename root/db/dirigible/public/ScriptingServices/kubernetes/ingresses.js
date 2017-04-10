/* globals $ */
/* eslint-env node, dirigible */

var IngressesApi = function() {

	this.getApiVersion = function() {
		return 'apis/extensions/v1beta1';
	};

	this.getApiKind = function() {
		return 'ingresses';
	};

	return this;
};

IngressesApi.prototype = require('kubernetes/api');

module.exports = new IngressesApi();
