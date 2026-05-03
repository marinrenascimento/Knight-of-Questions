import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export class Avaliacao extends Model {}

Avaliacao.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    is_vestibular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Avaliacao',
    tableName: 'avaliacao',
    timestamps: false,
  }
);