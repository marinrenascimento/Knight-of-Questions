import { User } from '../models/index.js';
import { sanitizeUser } from '../utils/userUtils.js';

function parseId(value) {
  const id = Number.parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
}

/**
 * GET /users/list
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
 * GET /users/view/:id
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
 * PUT /users/update/:id
 * 
 * Atualiza um usuário
 */
export const updateUser = async (req, res) => {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  if (req.authUser.id !== id && req.authUser.role !== 'admin') {
    return res.status(403).json({
      message: 'Você não tem permissão para alterar o perfil de outros usuários'
    });
  }

  const { nome, email } = req.body || {};

  if (!nome || !email) {
    return res.status(400).json({ message: 'Nome e email são obrigatórios' });
  }

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
 * DELETE /users/delete/:id
 * 
 * Remove um usuário
 */
export const deleteUser = async (req, res) => {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  if (req.authUser.id !== id && req.authUser.role !== 'admin') {
    return res.status(403).json({
      message: 'Você não tem permissão para deletar outros usuários'
    });
  }

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  await user.destroy();

  return res.json({
    message: 'Usuário deletado com sucesso'
  });
};