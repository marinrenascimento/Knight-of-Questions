import { Post, User } from '../models/index.js';

function parseId(value) {
  const id = Number.parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
}

// GET /posts/:id - Buscar post incluindo o autor (N -> 1)
export const getPostById = async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: 'ID inválido' });

  const post = await Post.findByPk(id, {
    include: [{ model: User, as: 'author' }],
  });

  if (!post) return res.status(404).json({ message: 'Post não encontrado' });
  res.json(post);
};