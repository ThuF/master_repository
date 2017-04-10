/* globals $ */
/* eslint-env node, dirigible */

const PATH = "/containers";
const HTML_LINK = "../templates/containers.html";

//exports.getMenuItem = function() {
//	return {  
//      "name": "Containers",
//      "path": PATH,
//      "link": HTML_LINK
//   };
//};

exports.getSidebarItem = function() {
	return {  
      "name": "Containers",
      "path": PATH,
      "link": HTML_LINK,
      "category": "Operate",
      "order": 402
   };
};
