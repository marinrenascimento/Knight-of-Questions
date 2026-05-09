import { Disciplina, Conteudo } from '../models/index.js';

/**
 * GET /disciplinas/getAll
 * 
 * Busca todas as diciplinas cadastradas
 */
export const getAllDisciplinas = async (req, res) => {
    try {
        const disciplinas = await Disciplina.findAll();
        res.json(disciplinas);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar disciplinas', error: err.message });
    }
};

/**
 * GET /disciplinas/getByID/:id
 * 
 * Busca as informações de uma disciplina com base no seu id
 */
export const getDisciplinaById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const disciplina = await Disciplina.findByPk(id, {
            // Requer que a associação hasMany exista no index.js
            include: [{ model: Conteudo, as: 'conteudos' }]
        });

        if (!disciplina) {
            return res.status(404).json({ message: 'Disciplina não encontrada' }); 7
        }
        res.json(disciplina);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar disciplina', error: err.message });
    }
};

export const createDisciplina = async (req, res) => {
    try {
        const { nome } = req.body;
        if (!nome) return res.status(400).json({ message: 'Nome é obrigatório' });

        const disciplina = await Disciplina.create({ nome });
        res.status(201).json(disciplina);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar disciplina', error: err.message });
    }
};

export const updateDisciplina = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { nome } = req.body;

        const disciplina = await Disciplina.findByPk(id);
        if (!disciplina) return res.status(404).json({ message: 'Disciplina não encontrada' });

        await disciplina.update({ nome });
        res.json(disciplina);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar disciplina', error: err.message });
    }
};

export const deleteDisciplina = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const disciplina = await Disciplina.findByPk(id);

        if (!disciplina) return res.status(404).json({ message: 'Disciplina não encontrada' });

        await Conteudo.destroy({ where: { disciplina_id: id } }); // Remove conteúdos vinculados
        await disciplina.destroy();

        res.json({ message: 'Disciplina deletada com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao deletar disciplina', error: err.message });
    }
};