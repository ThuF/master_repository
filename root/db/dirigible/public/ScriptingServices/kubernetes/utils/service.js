/* globals $ */
/* eslint-env node, dirigible */

exports.getObject = function(name, namespace, labels, selector, ports, type) {
	return {
	    'kind': 'Service',
	    'apiVersion': 'v1',
	    'metadata': {
	    	'name': name,
    		'namespace': namespace,
    		'labels': labels
	    },
	    'spec': {
	        'selector': selector,
	        'ports': ports,
	        'type': type
	    }
	};
};

exports.getPort = function(port) {
	return {
		'port': port
	};
};
