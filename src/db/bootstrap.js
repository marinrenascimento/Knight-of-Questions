import { runMigrations } from './runMigrations.js';
import { runSeeders } from './runSeeders.js';
import { sequelize } from '../config/sequelize.js';

export async function bootstrapDb() {
  await runMigrations();
  await sequelize.sync({ alter: true });
  await runSeeders();
}