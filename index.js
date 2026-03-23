import express from 'express';
import userRoutes from './src/routes/userRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
import { sequelize } from './src/config/sequelize.js';
import { initModels } from './src/models/index.js';
import { bootstrapDb } from './src/db/bootstrap.js';

initModels();
await bootstrapDb();
await sequelize.query('PRAGMA foreign_keys = ON;');

const app = express();
const port = 3000;

app.use(express.json());

app.use('/users', userRoutes);
app.use('/posts', postRoutes);

app.get('/', (req, res) => {
    res.send('API com Express funcionando!');
});
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});