import fs from 'node:fs';
import path from 'node:path';
import { Sequelize } from 'sequelize';

const dataDir = path.resolve(process.cwd(), 'data');
const storage = path.join(dataDir, 'database.sqlite');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false,
});