const mysql = require('mysql');
const config = require('../config/config');

module.exports = mysql.createPool(config.dbUri);
