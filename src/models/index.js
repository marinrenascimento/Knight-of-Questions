import { User } from './user.model.js';
import { Post } from './post.model.js';

let initialized = false;

export function initModels() {
  if (initialized) return;
  initialized = true;

  User.hasMany(Post, { as: 'posts', foreignKey: 'userId' });

  Post.belongsTo(User, { as: 'author', foreignKey: 'userId' });
}

export { User, Post };