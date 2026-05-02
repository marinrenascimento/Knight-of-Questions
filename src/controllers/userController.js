import { User } from '../models/index.js';
import { sanitizeUser } from '../utils/userUtils.js';

function parseId(value) {
  const id = Number.parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
}

/**
 * GET /users
 * 
 * Lista todos os usuários
 */
export const getAllUsers = async (req, res) => {
  const users = await User.findAll({ order: [['id', 'ASC']] });

  const sanitizedUsers = [];

  for (let i = 0; i < users.length; i++) {
    sanitizedUsers.push(sanitizeUser(users[i]));
  }

  res.json(sanitizedUsers);
};

/**
 * GET /users/:id
 * 
 * Busca um usuário por ID
 */
export const getUserById = async (req, res) => {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  res.json(sanitizeUser(user));
};

/**
 * PUT /users/:id
 * 
 * Atualiza um usuário
 */
export const updateUser = async (req, res) => {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  const { nome, email } = req.body;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  try {
    await user.update({ nome, email });
    res.json(sanitizeUser(user));
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar usuário', details: err.message });
  }
};

/**
 * DELETE /users/:id
 * 
 * Remove um usuário
 */
export const deleteUser = async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: 'ID inválido' });

  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  await user.destroy();
  res.status(204).send();
};

/**
 * PUT /users/:id/avatar
 * 
 * Seleciona um avatar para o usuário
 */
export const selecionarAvatar = async (req, res) => {
  const userId = parseId(req.params.id);
  if (userId === null) {
    return res.status(400).json({
      message: 'O id do usuário é inválido'
    });
  }

  const { id_avatar } = req.body;

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

    const Avatar = (await import('../models/avatar.model.js')).Avatar;
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