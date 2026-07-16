import { createPool } from 'mysql2';
import fs from 'fs';

const password = fs.readFileSync('/run/secrets/mysql_password', 'utf8').trim();

const pool = createPool({host: 'mariadb',
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: password});

export = pool;