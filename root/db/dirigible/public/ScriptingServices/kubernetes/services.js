/* globals $ */
/* eslint-env node, dirigible */

var ServicesApi = function() {

	this.getApiVersion = function() {
		return 'api/v1';
	};

	this.getApiKind = function() {
		return 'services';
	};

	return this;
};

ServicesApi.prototype = require('kubernetes/api');

module.exports = new ServicesApi();
