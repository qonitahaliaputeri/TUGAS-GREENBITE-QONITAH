// // config/db.js

// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'greenbite',
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//     return;
//   }
//   console.log('Connected to the database');
// });

// module.exports = connection;

const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'username',
  password: 'password',
  database: 'database_name',
});

module.exports = db;