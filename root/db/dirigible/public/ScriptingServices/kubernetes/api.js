/* globals $ */
/* eslint-env node, dirigible */

var Api = function() {

	var httpClient = require('net/http/client');
	var generator = require('platform/generator');

	this.listAll = function(server, token, queryOptions) {
		var url = this.getApiUrl(server);
		url = addQueryOptions(url, queryOptions);

		var httpResponse = httpClient.get(url, getOptions(token));

		var data = httpResponse.data ? JSON.parse(httpResponse.data) : null;
		return data && data.items ? data.items : [];
	};

	this.list = function(server, token, namespace, queryOptions) {
		var url = this.getApiBaseUrl(server, namespace);
		url = addQueryOptions(url, queryOptions);

		var httpResponse = httpClient.get(url, getOptions(token));

		var data = httpResponse.data ? JSON.parse(httpResponse.data) : null;
		return data && data.items ? data.items : [];
	};

	this.get = function(server, token, namespace, name) {
		var url = this.getApiItemUrl(server, namespace, name);
		var httpResponse = httpClient.get(url, getOptions(token));

		return JSON.parse(httpResponse.data);
	};
	
	this.create = function(server, token, namespace, body) {
		var url = this.getApiBaseUrl(server, namespace);
		var httpResponse = httpClient.post(url, getOptions(token, body));
		return JSON.parse(httpResponse.data);
	};

	this.update = function(server, token, namespace, name, body) {
		var url = this.getApiItemUrl(server, namespace, name);
		var httpResponse = httpClient.put(url, getOptions(token, body));
		return JSON.parse(httpResponse.data);
	};

	this.delete = function(server, token, namespace, name) {
		var url = this.getApiItemUrl(server, namespace, name);
		var httpResponse = httpClient.delete(url, getOptions(token));

		return JSON.parse(httpResponse.data);
	};

	this.getApiUrl = function(server) {
		var urlTemplate = '${server}/' + this.getApiVersion() + '/' + this.getApiKind();
		return generator.generate(urlTemplate, {
			'server': server
		});
	};

	this.getApiBaseUrl = function(server, namespace) {
		var urlTemplate = '${server}/' + this.getApiVersion() + '/namespaces/${namespace}/' + this.getApiKind();
		return generator.generate(urlTemplate, {
			'server': server,
			'namespace': namespace
		});
	};

	this.getApiItemUrl = function(server, namespace, name) {
		var urlTemplate = '${server}/' + this.getApiVersion() + '/namespaces/${namespace}/' + this.getApiKind() + '/${name}';
		return generator.generate(urlTemplate, {
			'server': server,
			'namespace': namespace,
			'name': name
		});
	};

	this.getApiVersion = function() {
		// This method should be overridden by the inheriting object
		throw new Error('Not Implemented!');
	};

	this.getApiKind = function() {
		// This method should be overridden by the inheriting object
		throw new Error('Not Implemented!');
	};

	function addQueryOptions(apiPath, queryOptions) {
		if (queryOptions !== undefined && queryOptions !== null) {
			if (queryOptions.labelSelector !== undefined && queryOptions.labelSelector !== null) {
				return apiPath + '?labelSelector=' + queryOptions.labelSelector;
			}
		}
		return apiPath;
	}

	function getOptions(token, body) {
		var options = {
			'headers': [{
				'name': 'Authorization',
				'value': 'Bearer ' + token
			}]
		};
		if (body !== undefined && body !== null) {
			options.headers.push({
				'name': 'Content-Type',
				'value': 'application/json'
			});
			options.body = JSON.stringify(body);
		}
		return options;
	}

	return this;
};

module.exports = new Api();
