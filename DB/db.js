const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mini-v1',
  multipleStatements: true
});

module.exports = connection;