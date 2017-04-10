/* globals $ */
/* eslint-env node, dirigible */

var database = require('db/database');
var datasource = database.getDatasource();
var sitesDaoExtensionsUtils = require('zeus/sites/utils/sitesDaoExtensionUtils');
var user = require("net/http/user");

// Create an entity
exports.create = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'INSERT INTO ZEUS_SITES (SITE_ID,SITE_NAME,SITE_URL,SITE_DESCRIPTION,SITE_NOTES,SITE_REGISTERED_AT,SITE_REGISTERED_BY) VALUES (?,?,?,?,?,?,?)';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = datasource.getSequence('ZEUS_SITES_SITE_ID').next();
        statement.setInt(++i, id);
        statement.setString(++i, entity.site_name);
        statement.setString(++i, entity.site_url);
        statement.setString(++i, entity.site_description);
        statement.setString(++i, entity.site_notes);
        statement.setTimestamp(++i, new Date());
        statement.setString(++i, user.getName());
		sitesDaoExtensionsUtils.beforeCreate(connection, entity);
        statement.executeUpdate();
        sitesDaoExtensionsUtils.afterCreate(connection, entity);
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
        var sql = 'SELECT * FROM ZEUS_SITES WHERE SITE_ID = ?';
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
        sql += ' * FROM ZEUS_SITES';
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
        var sql = 'UPDATE ZEUS_SITES SET   SITE_NAME = ?, SITE_URL = ?, SITE_DESCRIPTION = ?, SITE_NOTES = ? WHERE SITE_ID = ?';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, entity.site_name);
        statement.setString(++i, entity.site_url);
        statement.setString(++i, entity.site_description);
        statement.setString(++i, entity.site_notes);
        statement.setInt(++i, entity.site_id);
		sitesDaoExtensionsUtils.beforeUpdate(connection, entity);
        statement.executeUpdate();
        sitesDaoExtensionsUtils.afterUpdate(connection, entity);
    } finally {
        connection.close();
    }
};

// Delete an entity
exports.delete = function(entity) {
    var connection = datasource.getConnection();
    try {
    	var sql = 'DELETE FROM ZEUS_SITES WHERE SITE_ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setString(1, entity.site_id);
        sitesDaoExtensionsUtils.beforeDelete(connection, entity);
        statement.executeUpdate();
        sitesDaoExtensionsUtils.afterDelete(connection, entity);
    } finally {
        connection.close();
    }
};

// Return the entities count
exports.count = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM ZEUS_SITES';
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
		name: 'zeus_sites',
		type: 'object',
		properties: [
		{
			name: 'site_id',
			type: 'integer',
			key: 'true',
			required: 'true'
		},
		{
			name: 'site_name',
			type: 'string'
		},
		{
			name: 'site_url',
			type: 'string'
		},
		{
			name: 'site_description',
			type: 'string'
		},
		{
			name: 'site_notes',
			type: 'string'
		},
		{
			name: 'site_registered_at',
			type: 'timestamp'
		},
		{
			name: 'site_registered_by',
			type: 'string'
		},
		]
	};
	return metadata;
};

// Create an entity as JSON object from ResultSet current Row
function createEntity(resultSet) {
    var result = {};
	result.site_id = resultSet.getInt('SITE_ID');
    result.site_name = resultSet.getString('SITE_NAME');
    result.site_url = resultSet.getString('SITE_URL');
    result.site_description = resultSet.getString('SITE_DESCRIPTION');
    result.site_notes = resultSet.getString('SITE_NOTES');
    if (resultSet.getTimestamp('SITE_REGISTERED_AT') !== null) {
        result.site_registered_at = new Date(resultSet.getTimestamp('SITE_REGISTERED_AT').getTime());
    } else {
        result.site_registered_at = null;
    }
    result.site_registered_by = resultSet.getString('SITE_REGISTERED_BY');
    return result;
}

