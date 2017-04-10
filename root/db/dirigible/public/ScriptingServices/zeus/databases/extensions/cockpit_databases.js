/* globals $ */
/* eslint-env node, dirigible */

const PATH = "/databases";
const HTML_LINK = "../databases/index.html";

//exports.getMenuItem = function() {
//	return {  
//      "name": "Databases",
//      "path": PATH,
//      "link": HTML_LINK
//   };
//};

exports.getSidebarItem = function() {
	return {  
      "name": "Databases",
      "path": PATH,
      "link": HTML_LINK,
      "category": "Discover",
      "order": 302
   };
};
