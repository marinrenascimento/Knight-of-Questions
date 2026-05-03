import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { sequelize } from '../../config/sequelize.js';
import { User, Avatar, Disciplina, Conteudo, Deck, Flashcard, Avaliacao, Pergunta } from '../../models/index.js';

describe('Integracao de Models', () => {
  beforeAll(async () => {
    // Sincroniza e limpa as tabelas antes de todos os testes
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('1. Deve criar um Avatar', async () => {
    const avatar = await Avatar.create({
      nome: 'Bronze Teste',
      imagem_url: 'http://example.com/bronze.png',
      nivel_requerido: 0
    });
    expect(avatar).toHaveProperty('id');
  });

  it('2. Deve criar um Usuário', async () => {
    const avatar = await Avatar.create({
      nome: 'Prata Teste',
      imagem_url: 'http://example.com/prata.png',
      nivel_requerido: 1
    });

    const user = await User.create({
      nome: 'Gabriel Teste',
      username: 'gabriel_teste',
      email: 'gabriel@teste.com',
      senha_hash: 'hash_seguro',
      id_avatar: avatar.id,
      role: 'estudante'
    });

    expect(user).toHaveProperty('id');
    expect(user.username).toBe('gabriel_teste');
  });

  it('3. Deve criar uma Disciplina', async () => {
    const disciplina = await Disciplina.create({ nome: 'Física' });
    expect(disciplina).toHaveProperty('id');
    expect(disciplina.nome).toBe('Física');
  });

  it('4. Deve criar um Conteúdo', async () => {
    const disciplina = await Disciplina.create({ nome: 'Biologia' });
    const conteudo = await Conteudo.create({
      nome: 'Citologia',
      disciplina_id: disciplina.id
    });

    expect(conteudo).toHaveProperty('id');
    expect(conteudo.disciplina_id).toBe(disciplina.id);
  });

  it('5. Deve criar um Deck', async () => {
    // Cria usuário necessário
    const avatar = await Avatar.create({
      nome: 'Ouro Teste',
      imagem_url: 'http://example.com/ouro.png',
      nivel_requerido: 2
    });
    const user = await User.create({
      nome: 'Usuário Deck',
      username: 'user_deck',
      email: 'userdeck@teste.com',
      senha_hash: 'hash',
      id_avatar: avatar.id
    });

    const deck = await Deck.create({
      nome: 'Fórmulas Salva-Vidas',
      id_user: user.id
    });

    expect(deck).toHaveProperty('id');
  });

  it('6. Deve criar um Flashcard', async () => {
    // Cria dependências
    const avatar = await Avatar.create({
      nome: 'Diamante Teste',
      imagem_url: 'http://example.com/diamante.png',
      nivel_requerido: 5
    });
    const user = await User.create({
      nome: 'Usuário Flash',
      username: 'user_flash',
      email: 'userflash@teste.com',
      senha_hash: 'hash',
      id_avatar: avatar.id
    });
    const disciplina = await Disciplina.create({ nome: 'Química' });
    const conteudo = await Conteudo.create({
      nome: 'Estequiometria',
      disciplina_id: disciplina.id
    });
    const deck = await Deck.create({
      nome: 'Deck Química',
      id_user: user.id
    });

    const flashcard = await Flashcard.create({
      frente: 'Qual é o valor da constante de Avogadro?',
      verso: '6,02 x 10^23',
      dificuldade: 2,
      id_deck: deck.id,
      id_disciplina: disciplina.id,
      id_conteudo: conteudo.id
    });

    expect(flashcard).toHaveProperty('id');
    expect(flashcard.frente).toContain('Avogadro');
  });

  it('7. Deve criar uma Avaliação', async () => {
    const avaliacao = await Avaliacao.create({
      titulo: 'Simulado de Ciências'
    });
    expect(avaliacao).toHaveProperty('id');
    expect(avaliacao.titulo).toBe('Simulado de Ciências');
  });

  it('8. Deve criar uma Pergunta', async () => {
    const disciplina = await Disciplina.create({ nome: 'História' });
    const avaliacao = await Avaliacao.create({ titulo: 'Simulado História' });
    const conteudo = await Conteudo.create({ nome: 'Segunda Guerra', disciplina_id: disciplina.id });

    const pergunta = await Pergunta.create({
      enunciado: 'Qual foi o estopim da Segunda Guerra Mundial na Europa?',
      nivel_dificuldade: 1,
      disciplina_id: disciplina.id,
      id_avaliacao: avaliacao.id,
      conteudo_id: conteudo.id
    });

    expect(pergunta).toHaveProperty('id');
    expect(pergunta.disciplina_id).toBe(disciplina.id);
  });
});