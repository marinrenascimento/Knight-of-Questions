import express from 'express';
import 'dotenv/config';
import userRoutes from './src/routes/userRoutes.js';
import avatarRoutes from './src/routes/avatarRoutes.js';
import { initModels } from './src/models/index.js';
import { bootstrapDb } from './src/db/bootstrap.js';
import authRoutes from './src/routes/authRoutes.js';
import ofensivaRoutes from './src/routes/ofensivaRoutes.js';
import acessosRecentesRoutes from './src/routes/acessosRecentesRoutes.js';

initModels();
await bootstrapDb();
const app = express();
const port = Number.parseInt(process.env.PORT ?? '3000', 10);

app.use(express.json());

app.use('/users', userRoutes);
app.use('/avatares', avatarRoutes);
app.use('/auth', authRoutes);
app.use('/ofensiva', ofensivaRoutes);
app.use('/acessos', acessosRecentesRoutes);
app.get('/', (req, res) => {
    res.send('API com Express funcionando!');
});
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});