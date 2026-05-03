import { Conteudo, Flashcard, Pergunta } from '../models/index.js';

export const getAllConteudosByDisciplina = async (req, res) => {
    try {
        const disciplina_id = parseInt(req.params.disciplinaId, 10);
        const conteudos = await Conteudo.findAll({ where: { disciplina_id } });
        res.json(conteudos);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar conteúdos', error: err.message });
    }
};

export const getConteudoById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const conteudo = await Conteudo.findByPk(id);
        if (!conteudo) return res.status(404).json({ message: 'Conteúdo não encontrado' });
        res.json(conteudo);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar conteúdo', error: err.message });
    }
};

export const createConteudo = async (req, res) => {
    try {
        const { nome, disciplina_id } = req.body;
        if (!nome || !disciplina_id) return res.status(400).json({ message: 'Nome e disciplina_id são obrigatórios' });

        const conteudo = await Conteudo.create({ nome, disciplina_id });
        res.status(201).json(conteudo);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar conteúdo', error: err.message });
    }
};

export const updateConteudo = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { nome } = req.body;

        const conteudo = await Conteudo.findByPk(id);
        if (!conteudo) return res.status(404).json({ message: 'Conteúdo não encontrado' });

        await conteudo.update({ nome });
        res.json(conteudo);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar conteúdo', error: err.message });
    }
};

export const deleteConteudo = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        
        // Verifica vínculos
        const flashcards = await Flashcard.count({ where: { id_conteudo: id } });
        const perguntas = await Pergunta.count({ where: { conteudo_id: id } });

        if (flashcards > 0 || perguntas > 0) {
            return res.status(400).json({ 
                message: 'Não é possível deletar. O conteúdo possui flashcards ou perguntas vinculadas.' 
            });
        }

        const conteudo = await Conteudo.findByPk(id);
        if (!conteudo) return res.status(404).json({ message: 'Conteúdo não encontrado' });

        await conteudo.destroy();
        res.json({ message: 'Conteúdo deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao deletar conteúdo', error: err.message });
    }
};