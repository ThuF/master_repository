/* globals $ */
/* eslint-env node, dirigible */

var database = require('db/database');
var datasource = database.getDatasource();
var databasesDaoExtensionsUtils = require('zeus/databases/utils/databasesDaoExtensionUtils');
var user = require("net/http/user");

// Create an entity
exports.create = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'INSERT INTO ZEUS_DATABASES (DB_ID,DB_NAME,DB_TYPE,DB_URL,DB_USERNAME,DB_PASSWORD,DB_CREATED_AT,DB_CREATED_BY) VALUES (?,?,?,?,?,?,?,?)';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = datasource.getSequence('ZEUS_DATABASES_DB_ID').next();
        statement.setInt(++i, id);
        statement.setString(++i, entity.db_name);
        statement.setString(++i, entity.db_type);
        statement.setString(++i, entity.db_url);
        statement.setString(++i, entity.db_username);
        statement.setString(++i, entity.db_password);
        statement.setTimestamp(++i, new Date());
        statement.setString(++i, user.getName());
		databasesDaoExtensionsUtils.beforeCreate(connection, entity);
        statement.executeUpdate();
        databasesDaoExtensionsUtils.afterCreate(connection, entity);
    	return id;
    } finally {
        connection.close();
    }
};

// Return a single entity by Id
exports.get = function(id) {
	var entity = null;
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT * FROM ZEUS_DATABASES WHERE DB_ID = ?';
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
        sql += ' * FROM ZEUS_DATABASES';
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

// Update an entity by Id
exports.update = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'UPDATE ZEUS_DATABASES SET   DB_NAME = ?, DB_TYPE = ?, DB_URL = ?, DB_USERNAME = ?, DB_PASSWORD = ? WHERE DB_ID = ?';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, entity.db_name);
        statement.setString(++i, entity.db_type);
        statement.setString(++i, entity.db_url);
        statement.setString(++i, entity.db_username);
        statement.setString(++i, entity.db_password);
        statement.setInt(++i, entity.db_id);
		databasesDaoExtensionsUtils.beforeUpdate(connection, entity);
        statement.executeUpdate();
        databasesDaoExtensionsUtils.afterUpdate(connection, entity);
    } finally {
        connection.close();
    }
};

// Delete an entity
exports.delete = function(entity) {
    var connection = datasource.getConnection();
    try {
    	var sql = 'DELETE FROM ZEUS_DATABASES WHERE DB_ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setString(1, entity.db_id);
        databasesDaoExtensionsUtils.beforeDelete(connection, entity);
        statement.executeUpdate();
        databasesDaoExtensionsUtils.afterDelete(connection, entity);
    } finally {
        connection.close();
    }
};

// Return the entities count
exports.count = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM ZEUS_DATABASES';
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
		name: 'zeus_databases',
		type: 'object',
		properties: [
		{
			name: 'db_id',
			type: 'integer',
			key: 'true',
			required: 'true'
		},
		{
			name: 'db_name',
			type: 'string'
		},
		{
			name: 'db_type',
			type: 'string'
		},
		{
			name: 'db_url',
			type: 'string'
		},
		{
			name: 'db_username',
			type: 'string'
		},
		{
			name: 'db_password',
			type: 'string'
		},
		{
			name: 'db_created_at',
			type: 'timestamp'
		},
		{
			name: 'db_created_by',
			type: 'string'
		},
		]
	};
	return metadata;
};

// Create an entity as JSON object from ResultSet current Row
function createEntity(resultSet) {
    var result = {};
	result.db_id = resultSet.getInt('DB_ID');
    result.db_name = resultSet.getString('DB_NAME');
    result.db_type = resultSet.getString('DB_TYPE');
    result.db_url = resultSet.getString('DB_URL');
    result.db_username = resultSet.getString('DB_USERNAME');
    result.db_password = resultSet.getString('DB_PASSWORD');
    if (resultSet.getTimestamp('DB_CREATED_AT') !== null) {
        result.db_created_at = new Date(resultSet.getTimestamp('DB_CREATED_AT').getTime());
    } else {
        result.db_created_at = null;
    }
    result.db_created_by = resultSet.getString('DB_CREATED_BY');
    return result;
}

