/* globals $ */
/* eslint-env node, dirigible */

const PATH = "/applications";
const HTML_LINK = "../templates/applications.html";

//exports.getMenuItem = function() {
//	return {  
//      "name": "Applications",
//      "path": PATH,
//      "link": HTML_LINK
//   };
//};

exports.getSidebarItem = function() {
	return {  
      "name": "Templates",
      "path": PATH,
      "link": HTML_LINK,
      "category": "Operate",
      "order": 403
   };
};
