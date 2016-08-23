var mysql = require('mysql');
var dbPoolConfig = require('../config/dbpoolconfig');

var dbPool = mysql.createPool(dbPoolConfig);

module.exports.dbPool = dbPool;