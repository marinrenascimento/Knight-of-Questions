import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export class User extends Model { }

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    senha_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    pontos: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    nivel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    id_avatar: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Avatars',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'visitante',
    },
    criado_em: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: false,
    underscored: false
  },
);