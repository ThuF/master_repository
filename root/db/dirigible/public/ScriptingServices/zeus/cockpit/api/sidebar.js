/* globals $ */
/* eslint-env node, dirigible */

var response = require('net/http/response');
var cockpitExtensions = require('zeus/cockpit/extension/cockpitExtensionUtils');

var sidebarItems = cockpitExtensions.getSidebarItems();
sidebarItems.sort(function(a,b){
	if (a && b && a.order && b.order) {
		return a.order - b.order;
	} else if (a && b && a.order && !b.order) {
		return -1;
	} else if (a && b && !a.order && b.order) {
		return 1;
	}
	return -1;
});

response.println(JSON.stringify(sidebarItems));
response.flush();
response.close();
