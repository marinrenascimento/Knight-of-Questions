import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Pergunta, Disciplina, Avaliacao, Conteudo, User, Avatar } from '../../models/index.js';
import { sequelize } from '../../config/sequelize.js';

describe('Pergunta Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    await Avatar.create({ id: 1, nome: 'Bronze' });
    await User.create({
      id: 1,
      nome: 'User Teste Pergunta',
      username: 'user_perg',
      email: 'perg@teste.com',
      senha_hash: 'hash'
    });
    
    await Disciplina.create({ id: 1, nome: 'Química' });
    await Avaliacao.create({ id: 1, titulo: 'Simulado Química', id_user: 1 });
    await Conteudo.create({ id: 1, nome: 'Estequiometria', disciplina_id: 1 });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('deve criar uma pergunta com sucesso', async () => {
    const pergunta = await Pergunta.create({
      enunciado: 'Qual a massa molar da água?',
      nivel_dificuldade: 2,
      disciplina_id: 1,
      id_avaliacao: 1,
      conteudo_id: 1
    });

    expect(pergunta).toHaveProperty('id');
    expect(pergunta.enunciado).toBe('Qual a massa molar da água?');
  });
});