/* globals $ */
/* eslint-env node, dirigible */

var database = require('db/database');
var datasource = database.getDatasource();
var servicesDaoExtensionsUtils = require('zeus/services/utils/servicesDaoExtensionUtils');
var user = require("net/http/user");

// Create an entity
exports.create = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'INSERT INTO ZEUS_SERVICES (SERVICE_ID,SERVICE_NAME,SERVICE_URL,SERVICE_DEFINITION,SERVICE_TYPE,SERVICE_OWNER,SERVICE_CONTACT,SERVICE_DESCRIPTION,SERVICE_NOTES,SERVICE_REGISTERED_AT,SERVICE_REGISTERED_BY) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = datasource.getSequence('ZEUS_SERVICES_SERVICE_ID').next();
        statement.setInt(++i, id);
        statement.setString(++i, entity.service_name);
        statement.setString(++i, entity.service_url);
        statement.setString(++i, entity.service_definition);
        statement.setString(++i, entity.service_type);
        statement.setString(++i, entity.service_owner);
        statement.setString(++i, entity.service_contact);
        statement.setString(++i, entity.service_description);
        statement.setString(++i, entity.service_notes);
        statement.setTimestamp(++i, new Date());
        statement.setString(++i, user.getName());
		servicesDaoExtensionsUtils.beforeCreate(connection, entity);
        statement.executeUpdate();
        servicesDaoExtensionsUtils.afterCreate(connection, entity);
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
        var sql = 'SELECT * FROM ZEUS_SERVICES WHERE SERVICE_ID = ?';
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
        sql += ' * FROM ZEUS_SERVICES';
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
        var sql = 'UPDATE ZEUS_SERVICES SET   SERVICE_NAME = ?, SERVICE_URL = ?, SERVICE_DEFINITION = ?, SERVICE_TYPE = ?, SERVICE_OWNER = ?, SERVICE_CONTACT = ?, SERVICE_DESCRIPTION = ?, SERVICE_NOTES = ? WHERE SERVICE_ID = ?';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, entity.service_name);
        statement.setString(++i, entity.service_url);
        statement.setString(++i, entity.service_definition);
        statement.setString(++i, entity.service_type);
        statement.setString(++i, entity.service_owner);
        statement.setString(++i, entity.service_contact);
        statement.setString(++i, entity.service_description);
        statement.setString(++i, entity.service_notes);
        statement.setInt(++i, entity.service_id);
		servicesDaoExtensionsUtils.beforeUpdate(connection, entity);
        statement.executeUpdate();
        servicesDaoExtensionsUtils.afterUpdate(connection, entity);
    } finally {
        connection.close();
    }
};

// Delete an entity
exports.delete = function(entity) {
    var connection = datasource.getConnection();
    try {
    	var sql = 'DELETE FROM ZEUS_SERVICES WHERE SERVICE_ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setString(1, entity.service_id);
        servicesDaoExtensionsUtils.beforeDelete(connection, entity);
        statement.executeUpdate();
        servicesDaoExtensionsUtils.afterDelete(connection, entity);
    } finally {
        connection.close();
    }
};

// Return the entities count
exports.count = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM ZEUS_SERVICES';
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
		name: 'zeus_services',
		type: 'object',
		properties: [
		{
			name: 'service_id',
			type: 'integer',
			key: 'true',
			required: 'true'
		},
		{
			name: 'service_name',
			type: 'string'
		},
		{
			name: 'service_url',
			type: 'string'
		},
		{
			name: 'service_definition',
			type: 'string'
		},
		{
			name: 'service_type',
			type: 'string'
		},
		{
			name: 'service_owner',
			type: 'string'
		},
		{
			name: 'service_contact',
			type: 'string'
		},
		{
			name: 'service_description',
			type: 'string'
		},
		{
			name: 'service_notes',
			type: 'string'
		},
		{
			name: 'service_registered_at',
			type: 'timestamp'
		},
		{
			name: 'service_registered_by',
			type: 'string'
		},
		]
	};
	return metadata;
};

// Create an entity as JSON object from ResultSet current Row
function createEntity(resultSet) {
    var result = {};
	result.service_id = resultSet.getInt('SERVICE_ID');
    result.service_name = resultSet.getString('SERVICE_NAME');
    result.service_url = resultSet.getString('SERVICE_URL');
    result.service_definition = resultSet.getString('SERVICE_DEFINITION');
    result.service_type = resultSet.getString('SERVICE_TYPE');
    result.service_owner = resultSet.getString('SERVICE_OWNER');
    result.service_contact = resultSet.getString('SERVICE_CONTACT');
    result.service_description = resultSet.getString('SERVICE_DESCRIPTION');
    result.service_notes = resultSet.getString('SERVICE_NOTES');
    if (resultSet.getTimestamp('SERVICE_REGISTERED_AT') !== null) {
        result.service_registered_at = new Date(resultSet.getTimestamp('SERVICE_REGISTERED_AT').getTime());
    } else {
        result.service_registered_at = null;
    }
    result.service_registered_by = resultSet.getString('SERVICE_REGISTERED_BY');
    return result;
}

