/* globals $ */
/* eslint-env node, dirigible */

exports.getObject = function(name, namespace, labels, matchLabels, replicas, containers) {
	return {
		'kind': 'Deployment',
	    'apiVersion': 'extensions/v1beta1',
	    'metadata': {
	        'name': name,
	        'namespace': namespace,
	        'labels': labels
	    },
	    'spec': {
	        'replicas': replicas,
	        'selector': {
	            'matchLabels': matchLabels
	        },
	        'template': {
	            'metadata': {
	                'labels': labels
	            },
	            'spec': {
	                'containers': containers
                }
            }
        }
	};
};