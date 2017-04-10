/* globals $ */
/* eslint-env node, dirigible */

const PATH = "/services";
const HTML_LINK = "../services/index.html";

//exports.getMenuItem = function() {
//	return {  
//      "name": "Services",
//      "path": PATH,
//      "link": HTML_LINK
//   };
//};

exports.getSidebarItem = function() {
	return {  
      "name": "Services",
      "path": PATH,
      "link": HTML_LINK,
      "category": "Discover",
      "order": 303
   };
};
