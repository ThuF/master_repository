/* globals $ */
/* eslint-env node, dirigible */

var entityLib = require('entity');
var entityDelchev_books = require('delchev_books/delchev_books_lib');

handleRequest();

function handleRequest() {
	
	$.getResponse().setContentType("application/json; charset=UTF-8");
	$.getResponse().setCharacterEncoding("UTF-8");
	
	// get method type
	var method = $.getRequest().getMethod();
	method = method.toUpperCase();
	
	//get primary keys (one primary key is supported!)
	var idParameter = entityDelchev_books.getPrimaryKey();
	
	// retrieve the id as parameter if exist 
	var id = $.getXssUtils().escapeSql($.getRequest().getParameter(idParameter));
	var count = $.getXssUtils().escapeSql($.getRequest().getParameter('count'));
	var metadata = $.getXssUtils().escapeSql($.getRequest().getParameter('metadata'));
	var sort = $.getXssUtils().escapeSql($.getRequest().getParameter('sort'));
	var limit = $.getXssUtils().escapeSql($.getRequest().getParameter('limit'));
	var offset = $.getXssUtils().escapeSql($.getRequest().getParameter('offset'));
	var desc = $.getXssUtils().escapeSql($.getRequest().getParameter('desc'));
	
	if (limit === null) {
		limit = 100;
	}
	if (offset === null) {
		offset = 0;
	}
	
	if(!entityLib.hasConflictingParameters(id, count, metadata)) {
		// switch based on method type
		if ((method === 'POST')) {
			// create
			entityDelchev_books.createDelchev_books();
		} else if ((method === 'GET')) {
			// read
			if (id) {
				entityDelchev_books.readDelchev_booksEntity(id);
			} else if (count !== null) {
				entityDelchev_books.countDelchev_books();
			} else if (metadata !== null) {
				entityDelchev_books.metadataDelchev_books();
			} else {
				entityDelchev_books.readDelchev_booksList(limit, offset, sort, desc);
			}
		} else if ((method === 'PUT')) {
			// update
			entityDelchev_books.updateDelchev_books();    
		} else if ((method === 'DELETE')) {
			// delete
			if(entityLib.isInputParameterValid(idParameter)){
				entityDelchev_books.deleteDelchev_books(id);
			}
		} else {
			entityLib.printError($.getResponse().SC_BAD_REQUEST, 1, "Invalid HTTP Method");
		}
	}
	
	// flush and close the response
	$.getResponse().getWriter().flush();
	$.getResponse().getWriter().close();
}
