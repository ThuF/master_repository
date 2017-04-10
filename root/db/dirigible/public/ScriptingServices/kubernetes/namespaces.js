/* globals $ */
/* eslint-env node, dirigible */

var NamespacesApi = function() {

	var generator = require('platform/generator');

	this.getApiVersion = function() {
		return 'api/v1';
	};

	this.getApiKind = function() {
		return 'namespaces';
	};

	this.getApiBaseUrl = function(server) {
		return this.getApiUrl(server);
	};

	this.getApiItemUrl = function(server, namespace, name) {
		var urlTemplate = this.getApiBaseUrl(server) + '/${name}';
		return generator.generate(urlTemplate, {
			'name': name
		});
	};

	return this;
};

NamespacesApi.prototype = require('kubernetes/api');

module.exports = new NamespacesApi();
