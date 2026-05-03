import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Disciplina, Deck, User, Avatar, Conteudo, Flashcard } from '../../models/index.js';
import { sequelize } from '../../config/sequelize.js';

describe('Flashcard Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    // Criar dependências necessárias para o teste
    await Avatar.create({ id: 1, nome: 'Bronze' });
    await User.create({
      id: 1,
      nome: 'Usuário Teste',
      username: 'user_teste',
      email: 'teste@teste.com',
      senha_hash: 'hash'
    });
    await Deck.create({
      id: 1,
      nome: 'Deck Teste',
      id_user: 1
    });
    await Disciplina.create({ id: 1, nome: 'Física' });
    await Conteudo.create({ id: 1, nome: 'Newton', disciplina_id: 1 });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('deve criar um flashcard com sucesso', async () => {
    const flashcard = await Flashcard.create({
      frente: 'O que é F = m.a?',
      verso: 'Segunda Lei de Newton',
      id_deck: 1,
      dificuldade: 1,
      id_disciplina: 1,
      id_conteudo: 1
    });

    expect(flashcard).toHaveProperty('id');
    expect(flashcard.frente).toBe('O que é F = m.a?');
  });
});