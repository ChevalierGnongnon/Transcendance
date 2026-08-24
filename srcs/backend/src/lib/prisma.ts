import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.js';
import fs from 'fs';

const DATABASE_HOST = process.env.DB_HOST || 'mariadb';
const DATABASE_PORT = process.env.DB_PORT || '3306';
const DATABASE_NAME = process.env.MARIADB_DATABASE || 'transcendance';
const DATABASE_USER = process.env.MARIADB_USER || 'transcendance_user';
const passwordFile = process.env.MARIADB_PASSWORD_FILE;

if (!passwordFile || !DATABASE_HOST || !DATABASE_PORT || !DATABASE_NAME || !DATABASE_USER) {
  throw new Error('Mariadb envariment variables are not set');
}

const DATABASE_PASSWORD = fs.readFileSync(passwordFile, 'utf8').trim() || '123';

const adapter = new PrismaMariaDb({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export { prisma };
