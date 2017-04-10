/* globals $ */
/* eslint-env node, dirigible */

var files = require('io/files');
var httpClient = require('net/http/client');
var response = require('net/http/response');

var result;
var statusCode;

try {
	var token = files.readText('/var/run/secrets/kubernetes.io/serviceaccount/token');
	var server = 'https://kubernetes.default';
	var httpResponse = httpClient.get(server, {
		headers: [{
			name: "Authorization",
			value: "Bearer "+ token
		}]
	});
	statusCode = httpResponse.statusCode !== response.OK ? response.PRECONDITION_FAILED : response.OK;
	result = {
		'token': token,
		'server': server
	};
} catch (e) {
	statusCode = response.PRECONDITION_FAILED;
	result = {
		'errorMessage': 'Unable to \'Auto Discover\' cluster settings!',
		'detailedErrorMessage': '' + e
	};
	console.error(e);
}

response.setStatus(statusCode);
response.println(JSON.stringify(result));

response.flush();
response.close();
