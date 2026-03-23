import { runMigrations } from './runMigrations.js';
import { runSeeders } from './runSeeders.js';

export async function bootstrapDb() {
  await runMigrations();
  await runSeeders();
}