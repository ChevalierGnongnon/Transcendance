import { createPool } from 'mysql2';
import fs from 'fs';

const HOST = process.env.DB_HOST || "mariadb";
const DB_NAME = process.env.MARIADB_DATABASE;
const DB_USER_NAME = process.env.MARIADB_USER;
const passwordFile = process.env.MARIADB_PASSWORD_FILE;

if (!passwordFile || !HOST || !DB_NAME || !DB_USER_NAME) {
  throw new Error("Mariadb envariment variables are not set");
}

const password = fs.readFileSync(passwordFile, "utf8").trim();

const pool = createPool({
	host: HOST,
	port: 3306,
    database: DB_NAME,
    user: DB_USER_NAME,
    password: password
});

export = pool;
