import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export class Deck extends Model {}

Deck.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    criado_em: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Deck',
    tableName: 'deck',
    timestamps: false,
  }
);