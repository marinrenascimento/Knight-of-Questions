import { Avatar, User } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * GET /avatares
 * 
 * Busca todos os avatares cadastrados no banco de dados
 */
export const getAllAvatares = async (req, res) => {
    try {
        const avatares = await Avatar.findAll({
            order: [['nivel_requerido', 'ASC']]
        });
        res.json(avatares);
    } catch (err) {
        res.status(500).json({
            message: 'Erro ao buscar os avatares',
            details: err.message
        });
    }
};

/**
 * GET /avatares/disponiveis?userId=X
 * 
 * Busca os avatares disponíveis para o usuário baseado no nível dele
 */
export const getAvataresDisponiveis = async (req, res) => {
    const userId = req.query.userId || req.body.userId;

    if (!userId) {
        return res.status(400).json({
            message: 'O id do usuário é obrigatório'
        });
    }

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'Usuário não encontrado'
            });
        }

        const avatares = await Avatar.findAll({
            where: {
                nivel_requerido: {
                    [Op.lte]: user.nivel
                }
            },
            order: [['nivel_requerido', 'ASC']]
        });

        res.json(avatares);
    } catch (err) {
        res.status(500).json({
            message: 'Erro ao buscar avatares disponíveis',
            details: err.message
        });
    }
};

/**
 * GET /avatares/selecionado?userId=X
 * 
 * Busca o avatar atual do usuário com base no id dele
 */
export const getAvatarSelecionado = async (req, res) => {
    const userId = req.query.userId || req.body.userId;
    if (!userId) {
        return res.status(400).json({
            message: 'O id do usuário é obrigatório'
        });
    }

    try {
        const user = await User.findByPk(userId, {
            include: [{ model: Avatar, as: 'avatar' }]
        });

        if (!user) {
            return res.status(404).json({
                message: 'Usuário não encontrado'
            });
        }

        if (!user.avatar) {
            return res.status(404).json({
                message: 'Usuário não possui avatar selecionado'
            });
        }

        res.json(user.avatar);
    } catch (err) {
        res.status(500).json({
            message: 'Erro ao buscar avatar selecionado',
            details: err.message
        });
    }
};