/* globals $ */
/* eslint-env node, dirigible */

const PATH = "/sites";
const HTML_LINK = "../sites/index.html";

//exports.getMenuItem = function() {
//	return {  
//      "name": "Sites",
//      "path": PATH,
//      "link": HTML_LINK
//   };
//};

exports.getSidebarItem = function() {
	return {  
      "name": "Sites",
      "path": PATH,
      "link": HTML_LINK,
      "category": "Discover",
      "order": 304
   };
};
