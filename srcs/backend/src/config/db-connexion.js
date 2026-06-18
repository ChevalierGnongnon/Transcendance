const mysql = require('mysql2');
const fs = require('fs');
const password = fs.readFileSync('/run/secrets/mysql_password', 'utf8').trim();

const pool = mysql.createPool({host: 'mariadb', 
    database: process.env.MYSQL_DATABASE, 
    user: process.env.MYSQL_USER,
    password: password});

module.exports=pool;