import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Avaliacao, User, Avatar } from '../../models/index.js';
import { sequelize } from '../../config/sequelize.js';

describe('Avaliacao Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    await Avatar.create({ id: 1, nome: 'Bronze' });
    await User.create({
      id: 1,
      nome: 'Usuário Avaliação',
      username: 'user_aval',
      email: 'aval@teste.com',
      senha_hash: 'hash'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('deve criar uma avaliação associada a um usuário', async () => {
    const avaliacao = await Avaliacao.create({
      titulo: 'Simulado Ciências',
      id_user: 1,
      is_vestibular: true
    });

    expect(avaliacao).toHaveProperty('id');
    expect(avaliacao.titulo).toBe('Simulado Ciências');
    expect(avaliacao.is_vestibular).toBe(true);
  });
});