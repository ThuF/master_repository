/* globals $ */
/* eslint-env node, dirigible */

var DeploymentsApi = function() {

	this.getApiVersion = function() {
		return 'apis/extensions/v1beta1';
	};

	this.getApiKind = function() {
		return 'deployments';
	};

	return this;
};

DeploymentsApi.prototype = require('kubernetes/api');

module.exports = new DeploymentsApi();