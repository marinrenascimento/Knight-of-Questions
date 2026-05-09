import express from 'express';
import 'dotenv/config';
import { sequelize } from './src/config/sequelize.js';

import userRoutes from './src/routes/userRoutes.js';
import avatarRoutes from './src/routes/avatarRoutes.js';
import { initModels } from './src/models/index.js';
import { bootstrapDb } from './src/db/bootstrap.js';
import authRoutes from './src/routes/authRoutes.js';
import conteudoRoutes from './src/routes/conteudoRoutes.js';
import avaliacaoRoutes from './src/routes/avaliacaoRoutes.js';
import perguntaRoutes from './src/routes/perguntaRoutes.js';
import disciplinaRoutes from './src/routes/disciplinaRoutes.js'
import flashcardRoutes from './src/routes/flashcardRoutes.js'
import ofensivaRoutes from './src/routes/ofensivaRoutes.js';
import acessosRecentesRoutes from './src/routes/acessosRecentesRoutes.js';

initModels();

// Sincroniza os models com o banco (cria as tabelas que não existem)
// await sequelize.sync({ alter: true }); 

await bootstrapDb();
const app = express();
const port = Number.parseInt(process.env.PORT ?? '3000', 10);

app.use(express.json());

app.use('/users', userRoutes);
app.use('/avatares', avatarRoutes);
app.use('/auth', authRoutes);
app.use('/disciplinas', disciplinaRoutes);
app.use('/conteudos', conteudoRoutes);
app.use('/flashcards', flashcardRoutes);
app.use('/avaliacoes', avaliacaoRoutes);
app.use('/perguntas', perguntaRoutes);
app.use('/ofensiva', ofensivaRoutes);
app.use('/acessos', acessosRecentesRoutes);
app.get('/', (req, res) => {
    res.send('API com Express funcionando!');
});
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});