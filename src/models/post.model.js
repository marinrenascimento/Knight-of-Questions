import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'userId',
    },
  },
  {
    sequelize,
    modelName: 'Post',
    tableName: 'Posts',
    timestamps: true,
    underscored: false,
  },
);