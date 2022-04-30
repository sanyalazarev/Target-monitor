'use strict';

const mysql = require('mysql');

module.exports = mysql.createPool({
  host: 'localhost',
  user: '{DB_USER}',
  password: '{DB_PASS}',
  database: '{DB_NAME}',
  multipleStatements: true
});