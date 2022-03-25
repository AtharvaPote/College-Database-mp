const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'sakec',
  password: 'sakec123',
  database: 'mini-v1'
});

module.exports = connection;