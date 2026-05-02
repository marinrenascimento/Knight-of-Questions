import { Avatar, User } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * GET /avatares/list
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
 * GET /avatares/disponiveis
 * 
 * Busca os avatares disponíveis para o usuário logado com base no nível dele
 * Traz todos, mas os disponíveis vêm com a propriedade 'disponivel' = true e os indisponíveis com false
 */
export const getAvataresDisponiveisByUser = async (req, res) => {
    const userId = req.authUser?.id;

    if (!userId) {
        return res.status(401).json({
            message: 'Usuário não autenticado'
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
            order: [['nivel_requerido', 'ASC']]
        });

        const avataresComStatus = avatares.map(avatar => ({
            ...avatar.toJSON(),
            disponivel: user.nivel >= avatar.nivel_requerido
        }));

        res.json(avataresComStatus);
    } catch (err) {
        res.status(500).json({
            message: 'Erro ao buscar avatares disponíveis',
            details: err.message
        });
    }
};

/**
 * GET /avatares/selecionado
 * 
 * Busca o avatar atual do usuário logado
 */
export const getAvatarSelecionado = async (req, res) => {
    const userId = req.authUser?.id;

    if (!userId) {
        return res.status(400).json({
            message: 'O id do usuário não foi informado'
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

/**
 * PUT /avatares/selecionar
 * 
 * Seleciona um avatar para o usuário logado
 */
export const selecionarAvatar = async (req, res) => {
    const userId = req.authUser?.id;

    if (!userId) {
        return res.status(401).json({
            message: 'Usuário não autenticado'
        });
    }

    const { id_avatar } = req.body || {};

    if (!id_avatar) {
        return res.status(400).json({
            message: 'O id_avatar é obrigatório no corpo da requisição'
        });
    }

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'Usuário não encontrado'
            });
        }

        const avatar = await Avatar.findByPk(id_avatar);

        if (!avatar) {
            return res.status(404).json({
                message: 'Avatar não encontrado'
            });
        }

        if (user.nivel < avatar.nivel_requerido) {
            return res.status(403).json({
                message: 'Você ainda não conquistou o nível necessário para selecionar este avatar'
            });
        }

        await user.update({ id_avatar });
        res.json({
            message: 'Avatar selecionado com sucesso!',
            user
        });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao selecionar avatar', details: err.message });
    }
};