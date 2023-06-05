const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'chadkraus87',
  password: 'r0wDy712$',
  database: 'employeetracker'
});

module.exports = connection.promise();
