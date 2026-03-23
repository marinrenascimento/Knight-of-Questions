import { runSeeders } from './runSeeders.js';

runSeeders()
  .then(() => {
    console.log('Seeders concluídos.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Erro ao rodar seeders:', err);
    process.exit(1);
  });