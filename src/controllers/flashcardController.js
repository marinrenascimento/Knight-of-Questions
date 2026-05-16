import { Flashcard, User } from '../models/index.js';
import { sequelize } from '../config/sequelize.js';

/**
 * GET /view/:id
 * 
 * Busca um flashcard pelo ID
 */
export const getCardById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const card = await Flashcard.findByPk(id);

        if (!card) {
            return res.status(404).json({ message: 'Flashcard não encontrado' });
        }

        res.json(card);
    } catch (err) {
        res.status(500).json({
            message: 'Erro ao buscar flashcard',
            error: err.message
        });
    }
};

/**
 * GET /flashcards/filtro
 * 
 * Busca flashcards por conteúdo e disciplina e limite
 */
export const getCardsByConteudoAndDisciplinaAndLimite = async (req, res) => {
    try {
        const { disciplinaId, conteudoId, limite } = req.body ?? {};

        if (!disciplinaId || !limite || !conteudoId) {
            return res.status(400).json({
                message: 'Os campos disciplinaId, conteudoId e limite são obrigatórios'
            });
        }

        const cards = await Flashcard.findAll({
            where: {
                id_disciplina: disciplinaId,
                id_conteudo: conteudoId
            },
            limit: limite
        });

        res.json(cards);
    } catch (err) {
        res.status(500).json({
            message: 'Erro ao buscar flashcards',
            error: err.message
        });
    }
};

/**
 * GET /flashcards/deck/:deckId/dificuldade
 * 
 * Busca flashcards por deck ID e ordem de dificuldade
 */
export const getCardsByIdDeckOrderByDificuldade = async (req, res) => {
    try {
        const id_deck = parseInt(req.params.deckId, 10);
        const cards = await Flashcard.findAll({
            where: { id_deck },
            order: [['dificuldade', 'DESC']] // Mais difíceis primeiro
        });
        res.json(cards);
    } catch (err) {
        res.status(500).json({
            message: 'Erro ao buscar flashcards',
            error: err.message
        });
    }
};

/**
 * GET /flashcards/deck/:deckId
 * 
 * Busca flashcards por deck ID
 */
export const getCardsByIdDeck = async (req, res) => {
    try {
        const id_deck = parseInt(req.params.deckId, 10);
        const cards = await Flashcard.findAll({ where: { id_deck } });
        res.json(cards);
    } catch (err) {
        res.status(500).json({
            message: 'Erro ao buscar flashcards',
            error: err.message
        });
    }
};

/**
 * POST /flashcards/create
 * 
 * Cria um novo flashcard
 */
export const createCard = async (req, res) => {
    try {
        const { frente, verso, id_disciplina, id_conteudo, id_deck } = req.body ?? {};

        if (!frente || !verso || !id_disciplina || !id_conteudo || !id_deck) {
            return res.status(400).json({
                message: 'Os campos frente, verso, id_disciplina, id_conteudo e id_deck são obrigatórios'
            });
        }

        const newCard = await Flashcard.create({
            frente, verso, id_disciplina, id_conteudo, id_deck, dificuldade: 1
        });

        res.status(201).json(newCard);
    } catch (err) {
        res.status(500).json({
            message: 'Erro ao criar flashcard',
            error: err.message
        });
    }
};

/**
 * PATCH /flashcards/update/:id
 * 
 * Edita um flashcard existente
 */
export const editCard = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { frente, verso } = req.body ?? {};

        if (!frente || !verso) {
            return res.status(400).json({
                message: 'Os campos frente e verso são obrigatórios'
            });
        }

        const card = await Flashcard.findByPk(id);
        if (!card) {
            return res.status(404).json({
                message: 'Flashcard não encontrado'
            });
        }

        await card.update({ frente, verso });
        res.json(card);
    } catch (err) {
        res.status(500).json({
            message: 'Erro ao editar flashcard',
            error: err.message
        });
    }
};

/**
 * DELETE /flashcards/delete/:id
 * 
 * Deleta um flashcard existente
 */
export const deleteCard = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const card = await Flashcard.findByPk(id);

        if (!card) {
            return res.status(404).json({ message: 'Flashcard não encontrado' });
        }

        await card.destroy();

        res.json({
            message: 'Flashcard deletado com sucesso'
        });
    } catch (err) {
        res.status(500).json({
            message: 'Erro ao deletar flashcard',
            error: err.message
        });
    }
};

/**
 * PATCH /flashcards/review/:id
 * 
 * Atualiza a dificuldade de um flashcard e adiciona pontos ao usuário
 */
export const reviewCard = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const id = parseInt(req.params.id, 10);

        const { novaDificuldade, pontosGanhos, id_user } = req.body;

        if (novaDificuldade === undefined || isNaN(parseInt(novaDificuldade, 10))) {
            await transaction.rollback();
            return res.status(400).json({
                message: 'Erro: novaDificuldade é obrigatória e deve ser um número válido.'
            });
        }

        const card = await Flashcard.findByPk(id, { transaction });

        if (!card) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Flashcard não encontrado' });
        }

        await card.update(
            { dificuldade: parseInt(novaDificuldade, 10) },
            { transaction }
        );

        //TODO: tem que chamar aqui a função que soma pontos

        await transaction.commit();
        await card.reload();

        res.json({
            message: 'Revisão salva com sucesso',
            card,
            pontos_atribuídos: parseInt(pontosGanhos, 10) || 0
        });

    } catch (err) {
        if (transaction) await transaction.rollback();
        res.status(500).json({
            message: 'Erro ao revisar flashcard',
            error: err.message
        });
    }
};