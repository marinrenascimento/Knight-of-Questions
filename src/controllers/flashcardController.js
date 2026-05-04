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
        res.status(500).json({ message: 'Erro ao buscar flashcard', error: err.message });
    }
};

/**
 * GET /flashcards/cards-by-conteudo-and-disciplina-and-limite
 * 
 * Busca flashcards por conteúdo e disciplina e limite
 */
export const getCardsByConteudoAndDisciplinaAndLimite = async (req, res) => {
    try {
        const { disciplinaId, conteudoId, limite } = req.body;

        const cards = await Flashcard.findAll({
            where: {
                id_disciplina: disciplinaId,
                ...(conteudoId && { id_conteudo: conteudoId })
            },
            limit: limite ? parseInt(limite, 10) : 10
        });

        res.json(cards);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar flashcards', error: err.message });
    }
};

/**
 * GET /flashcards/cards-by-deck-id-order-by-dificuldade/:deckId
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
        res.status(500).json({ message: 'Erro ao buscar flashcards', error: err.message });
    }
};

/**
 * GET /flashcards/cards-by-deck-id/:deckId
 * 
 * Busca flashcards por deck ID
 */
export const getCardsByIdDeck = async (req, res) => {
    try {
        const id_deck = parseInt(req.params.deckId, 10);
        const cards = await Flashcard.findAll({ where: { id_deck } });
        res.json(cards);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar flashcards', error: err.message });
    }
};

/**
 * POST /flashcards/create-card
 * 
 * Cria um novo flashcard
 */
export const createCard = async (req, res) => {
    try {
        const { frente, verso, id_disciplina, id_conteudo, id_deck } = req.body;

        const newCard = await Flashcard.create({
            frente, verso, id_disciplina, id_conteudo, id_deck, dificuldade: 1
        });

        res.status(201).json(newCard);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar flashcard', error: err.message });
    }
};

/**
 * PATCH /flashcards/edit-card/:id
 * 
 * Edita um flashcard existente
 */
export const editCard = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { frente, verso } = req.body;

        const card = await Flashcard.findByPk(id);
        if (!card) return res.status(404).json({ message: 'Flashcard não encontrado' });

        await card.update({ frente, verso });
        res.json(card);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao editar flashcard', error: err.message });
    }
};

/**
 * DELETE /flashcards/delete-card/:id
 * 
 * Deleta um flashcard existente
 */
export const deleteCard = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const card = await Flashcard.findByPk(id);
        if (!card) return res.status(404).json({ message: 'Flashcard não encontrado' });

        // Aqui também deve-se deletar os reviews deste card caso existam em uma tabela FlashcardReview
        await card.destroy();
        res.json({ message: 'Flashcard deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao deletar flashcard', error: err.message });
    }
};

/**
 * PATCH /flashcards/review-card/:id
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

        if (id_user && pontosGanhos !== undefined) {
            const pontos = parseInt(pontosGanhos, 10);

            if (!isNaN(pontos)) {
                const user = await User.findByPk(id_user, { transaction });
                if (user) {
                    await user.increment('pontos', { by: pontos, transaction });
                }
            }
        }

        await transaction.commit();
        await card.reload();

        res.json({
            message: 'Revisão salva com sucesso',
            card,
            pontos_atribuídos: parseInt(pontosGanhos, 10) || 0
        });

    } catch (err) {
        if (transaction) await transaction.rollback();
        res.status(500).json({ message: 'Erro ao revisar flashcard', error: err.message });
    }
};