import { runMigrations } from './runMigrations.js';

runMigrations()
  .then(() => {
    console.log('Migrations concluídas.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Erro ao rodar migrations:', err);
    process.exit(1);
  });