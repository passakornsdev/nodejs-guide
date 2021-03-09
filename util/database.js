const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'passakorn',
    password: 'nodejs-guide',
    database: 'node_complete'
});

module.exports = pool.promise();
