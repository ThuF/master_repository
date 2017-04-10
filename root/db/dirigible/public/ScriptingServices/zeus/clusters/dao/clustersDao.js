/* globals $ */
/* eslint-env node, dirigible */

var database = require('db/database');
var datasource = database.getDatasource();
var clustersDaoExtensionsUtils = require('zeus/clusters/utils/clustersDaoExtensionUtils');
var user = require("net/http/user");

// Create an entity
exports.create = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'INSERT INTO ZEUS_CLUSTERS (CLUSTER_ID,CLUSTER_ACCOUNT,CLUSTER_NAMESPACE,CLUSTER_URL,CLUSTER_DEFAULT,CLUSTER_TOKEN,CLUSTER_INITIATED_AT,CLUSTER_INITIATED_BY) VALUES (?,?,?,?,?,?,?,?)';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = datasource.getSequence('ZEUS_CLUSTERS_CLUSTER_ID').next();
        statement.setInt(++i, id);
        statement.setString(++i, entity.cluster_account);
        statement.setString(++i, entity.cluster_namespace);
        statement.setString(++i, entity.cluster_url);
        statement.setInt(++i, entity.cluster_default);
        statement.setString(++i, entity.cluster_token);
        statement.setTimestamp(++i, new Date());
        statement.setString(++i, user.getName());
		clustersDaoExtensionsUtils.beforeCreate(connection, entity);
        statement.executeUpdate();
        clustersDaoExtensionsUtils.afterCreate(connection, entity);
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
        var sql = 'SELECT * FROM ZEUS_CLUSTERS WHERE CLUSTER_ID = ?';
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
        sql += ' * FROM ZEUS_CLUSTERS';
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
        var sql = 'UPDATE ZEUS_CLUSTERS SET   CLUSTER_ACCOUNT = ?, CLUSTER_NAMESPACE = ?, CLUSTER_URL = ?, CLUSTER_DEFAULT = ?, CLUSTER_TOKEN = ? WHERE CLUSTER_ID = ?';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, entity.cluster_account);
        statement.setString(++i, entity.cluster_namespace);
        statement.setString(++i, entity.cluster_url);
        statement.setInt(++i, entity.cluster_default);
        statement.setString(++i, entity.cluster_token);
        statement.setInt(++i, entity.cluster_id);
		clustersDaoExtensionsUtils.beforeUpdate(connection, entity);
        statement.executeUpdate();
        clustersDaoExtensionsUtils.afterUpdate(connection, entity);
    } finally {
        connection.close();
    }
};

// Delete an entity
exports.delete = function(entity) {
    var connection = datasource.getConnection();
    try {
    	var sql = 'DELETE FROM ZEUS_CLUSTERS WHERE CLUSTER_ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setString(1, entity.cluster_id);
        clustersDaoExtensionsUtils.beforeDelete(connection, entity);
        statement.executeUpdate();
        clustersDaoExtensionsUtils.afterDelete(connection, entity);
    } finally {
        connection.close();
    }
};

// Return the entities count
exports.count = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM ZEUS_CLUSTERS';
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
		name: 'zeus_clusters',
		type: 'object',
		properties: [
		{
			name: 'cluster_id',
			type: 'integer',
			key: 'true',
			required: 'true'
		},
		{
			name: 'cluster_account',
			type: 'string'
		},
		{
			name: 'cluster_namespace',
			type: 'string'
		},
		{
			name: 'cluster_url',
			type: 'string'
		},
		{
			name: 'cluster_default',
			type: 'integer'
		},
		{
			name: 'cluster_token',
			type: 'string'
		},
		{
			name: 'cluster_initiated_at',
			type: 'timestamp'
		},
		{
			name: 'cluster_initiated_by',
			type: 'string'
		},
		]
	};
	return metadata;
};

// Create an entity as JSON object from ResultSet current Row
function createEntity(resultSet) {
    var result = {};
	result.cluster_id = resultSet.getInt('CLUSTER_ID');
    result.cluster_account = resultSet.getString('CLUSTER_ACCOUNT');
    result.cluster_namespace = resultSet.getString('CLUSTER_NAMESPACE');
    result.cluster_url = resultSet.getString('CLUSTER_URL');
	result.cluster_default = resultSet.getInt('CLUSTER_DEFAULT');
    result.cluster_token = resultSet.getString('CLUSTER_TOKEN');
    if (resultSet.getTimestamp('CLUSTER_INITIATED_AT') !== null) {
        result.cluster_initiated_at = new Date(resultSet.getTimestamp('CLUSTER_INITIATED_AT').getTime());
    } else {
        result.cluster_initiated_at = null;
    }
    result.cluster_initiated_by = resultSet.getString('CLUSTER_INITIATED_BY');
    return result;
}

// Return the default cluster
exports.getDefault = function() {
	var entity = null;
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT * FROM ZEUS_CLUSTERS WHERE CLUSTER_DEFAULT = 1';
        var statement = connection.prepareStatement(sql);

        var resultSet = statement.executeQuery();
        if (resultSet.next()) {
            entity = createEntity(resultSet);
        }
    } finally {
        connection.close();
    }
    return entity;
};

