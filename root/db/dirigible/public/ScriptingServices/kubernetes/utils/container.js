/* globals $ */
/* eslint-env node, dirigible */

exports.getObject = function(name, image, ports) {
	return {
		'name': name,
		'image': image,
		'ports': ports
	};
};

exports.getPort = function(protocol, containerPort) {
	return {
		'protocol': protocol,
		'containerPort': containerPort
	};
};