/* globals $ */
/* eslint-env node, dirigible */

var ReplicaSetsApi = function() {

	this.getApiVersion = function() {
		return 'apis/extensions/v1beta1';
	};

	this.getApiKind = function() {
		return 'replicasets';
	};

	return this;
};

ReplicaSetsApi.prototype = require('kubernetes/api');

module.exports = new ReplicaSetsApi();
