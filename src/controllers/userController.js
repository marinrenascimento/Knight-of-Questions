import { Post, User } from '../models/index.js';

function parseId(value) {
  const id = Number.parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
}

// GET /users - Listar todos
export const getAllUsers = async (req, res) => {
  const users = await User.findAll({ order: [['id', 'ASC']] });
  res.json(users);
};

// GET /users/:id - Buscar por ID (inclui posts)
export const getUserById = async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: 'ID inválido' });

  const user = await User.findByPk(id, {
    include: [{ model: Post, as: 'posts' }],
  });

  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  res.json(user);
};

// POST /users - Criar novo
export const createUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Nome e email são obrigatórios' });
  }

  try {
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar usuário', details: err.message });
  }
};

// PUT /users/:id - Atualizar
export const updateUser = async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: 'ID inválido' });

  const { name, email } = req.body;

  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  try {
    await user.update({ name, email });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar usuário', details: err.message });
  }
};

// DELETE /users/:id - Remover
export const deleteUser = async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: 'ID inválido' });

  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  await user.destroy();
  res.status(204).send();
};

// GET /users/:id/posts - Listar posts de um usuário (1 -> N)
export const getPostsByUserId = async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: 'ID inválido' });

  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  const posts = await Post.findAll({
    where: { userId: id },
    order: [['id', 'ASC']],
  });

  res.json(posts);
};

// POST /users/:id/posts - Criar post para um usuário (1 -> N)
export const createPostByUserId = async (req, res) => {
  const userId = parseId(req.params.id);
  if (userId === null) return res.status(400).json({ message: 'ID inválido' });

  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ message: 'title e body são obrigatórios' });
  }

  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  const post = await Post.create({ title, body, userId });
  res.status(201).json(post);
};