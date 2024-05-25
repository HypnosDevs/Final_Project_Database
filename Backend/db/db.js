const mysql = require('mysql2');
require('dotenv').config()

const env = process.env;

const pool = mysql.createPool({
    host: env.MYSQL_LOCALHOST,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});



module.exports.pool = pool.promise();

