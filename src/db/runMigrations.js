import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Sequelize as SequelizeClass } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const metaTable = 'SequelizeMigrations';

export async function runMigrations() {
  await sequelize.authenticate();

  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS ${metaTable} (
      name TEXT PRIMARY KEY,
      runOn TIMESTAMP NOT NULL
    );
  `);

  const migrationsDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../migrations',
  );

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.js'))
    .sort();

  for (const file of files) {
    const name = file;

    const existing = await sequelize.query(
      `SELECT name FROM ${metaTable} WHERE name = :name LIMIT 1;`,
      {
        replacements: { name },
      },
    );

    const rows = Array.isArray(existing)
      ? Array.isArray(existing[0])
        ? existing[0]
        : existing
      : existing;
    const alreadyRan = Array.isArray(rows) && rows.length > 0;
    if (alreadyRan) continue;

    const migrationPath = path.join(migrationsDir, file);
    const mod = await import(pathToFileURL(migrationPath).href);

    if (typeof mod.up !== 'function') {
      throw new Error(`Migration "${file}" não exporta função "up".`);
    }

    await mod.up({ queryInterface: sequelize.getQueryInterface(), Sequelize: SequelizeClass });

    await sequelize.query(
      `INSERT INTO ${metaTable} (name, runOn) VALUES (:name, CURRENT_TIMESTAMP);`,
      { replacements: { name } },
    );
    console.log(`Migration aplicada: ${file}`);
  }
}