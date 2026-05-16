import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Disciplina } from '../../models/index.js';
import { sequelize } from '../../config/sequelize.js';

describe('Disciplina Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('deve criar uma nova disciplina com sucesso', async () => {
    const disciplina = await Disciplina.create({ nome: 'Matemática' });
    expect(disciplina).toHaveProperty('id');
    expect(disciplina.nome).toBe('Matemática');
  });

  it('não deve permitir a criação de uma disciplina sem nome', async () => {
    try {
      await Disciplina.create({});
      throw new Error('Deveria ter lançado erro de validação');
    } catch (error) {
      expect(error.name).toContain('SequelizeValidationError');
    }
  });
});