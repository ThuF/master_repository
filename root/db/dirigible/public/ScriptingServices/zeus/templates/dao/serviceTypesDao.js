/* globals $ */
/* eslint-env node, dirigible */

var database = require('db/database');
var datasource = database.getDatasource();

// Return a single entity by Id
exports.get = function(id) {
	var entity = null;
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT * FROM ZEUS_SERVICE_TYPES WHERE ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setInt(1, id);

        var resultSet = statement.executeQuery();
        if (resultSet.next()) {
            entity = createEntity(resultSet);
        }
    } finally {
        connection.close();
    }
    return entity;
};

// Return all entities
exports.list = function(limit, offset, sort, desc) {
    var result = [];
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT ';
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genTopAndStart(limit, offset);
        }
        sql += ' * FROM ZEUS_SERVICE_TYPES';
        if (sort !== null) {
            sql += ' ORDER BY ' + sort;
        }
        if (sort !== null && desc !== null) {
            sql += ' DESC ';
        }
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genLimitAndOffset(limit, offset);
        }
        var statement = connection.prepareStatement(sql);
        var resultSet = statement.executeQuery();
        while (resultSet.next()) {
            result.push(createEntity(resultSet));
        }
    } finally {
        connection.close();
    }
    return result;
};

// Return the entities count
exports.count = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM ZEUS_SERVICE_TYPES';
        var statement = connection.prepareStatement(sql);
        var rs = statement.executeQuery();
        if (rs.next()) {
            count = rs.getInt(1);
        }
    } finally {
        connection.close();
    }
    return count;
};

// Returns the metadata for the entity
exports.metadata = function() {
	var metadata = {
		name: 'zeus_service_types',
		type: 'object',
		properties: [
		{
			name: 'id',
			type: 'integer',
			key: 'true',
			required: 'true'
		},
		{
			name: 'name',
			type: 'string'
		},
		]
	};
	return metadata;
};

// Create an entity as JSON object from ResultSet current Row
function createEntity(resultSet) {
    var result = {};
	result.id = resultSet.getInt('ID');
    result.name = resultSet.getString('NAME');
    return result;
}

