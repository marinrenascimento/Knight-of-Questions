import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Disciplina, Conteudo } from '../../models/index.js';
import { sequelize } from '../../config/sequelize.js';

describe('Conteudo Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('deve criar um novo conteúdo associado a uma disciplina', async () => {
    const disciplina = await Disciplina.create({ nome: 'Biologia' });
    const conteudo = await Conteudo.create({
      nome: 'Citologia',
      disciplina_id: disciplina.id
    });

    expect(conteudo).toHaveProperty('id');
    expect(conteudo.nome).toBe('Citologia');
    expect(conteudo.disciplina_id).toBe(disciplina.id);
  });
});