/* globals $ */
/* eslint-env node, dirigible */

const PATH = "/clusters";
const HTML_LINK = "../clusters/index.html";

//exports.getMenuItem = function() {
//	return {  
//      "name": "Clusters",
//      "path": PATH,
//      "link": HTML_LINK
//   };
//};

exports.getSidebarItem = function() {
	return {  
      "name": "Clusters",
      "path": PATH,
      "link": HTML_LINK,
      "category": "Operate",
      "order": 401
   };
};
