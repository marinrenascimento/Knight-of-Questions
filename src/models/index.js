import { User } from './user.model.js';
import { Post } from './post.model.js';
import { Avatar } from './avatar.model.js';

let initialized = false;

export function initModels() {
  if (initialized) return;
  initialized = true;

  // Associações
  User.hasMany(Post, { as: 'posts', foreignKey: 'userId' });
  Post.belongsTo(User, { as: 'author', foreignKey: 'userId' });

  // Avatar - Usuário
  User.belongsTo(Avatar, { as: 'avatar', foreignKey: 'id_avatar' });
  Avatar.hasMany(User, { as: 'usuarios', foreignKey: 'id_avatar' });
}

export { User, Post, Avatar };