import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sequelize } from '../config/sequelize.js';

const metaTable = 'SequelizeSeeders';

export async function runSeeders() {
  await sequelize.authenticate();

  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS ${metaTable} (
      name TEXT PRIMARY KEY,
      runOn TIMESTAMP NOT NULL
    );
  `);

  const seedersDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../seeders',
  );

  const files = fs
    .readdirSync(seedersDir)
    .filter((f) => f.endsWith('.js'))
    .sort();

  for (const file of files) {
    const name = file;

    const existing = await sequelize.query(
      `SELECT name FROM ${metaTable} WHERE name = :name LIMIT 1;`,
      { replacements: { name } },
    );

    const rows = Array.isArray(existing)
      ? Array.isArray(existing[0])
        ? existing[0]
        : existing
      : existing;
    const alreadyRan = Array.isArray(rows) && rows.length > 0;
    if (alreadyRan) continue;

    const seederPath = path.join(seedersDir, file);
    const mod = await import(pathToFileURL(seederPath).href);

    if (typeof mod.up !== 'function') {
      throw new Error(`Seeder "${file}" não exporta função "up".`);
    }

    await mod.up({ queryInterface: sequelize.getQueryInterface() });

    await sequelize.query(
      `INSERT INTO ${metaTable} (name, runOn) VALUES (:name, CURRENT_TIMESTAMP);`,
      { replacements: { name } },
    );
    console.log(`Seeder aplicada: ${file}`);
  }
}