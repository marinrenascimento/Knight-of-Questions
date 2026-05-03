import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export class Disciplina extends Model {}

Disciplina.init(
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
  },
  {
    sequelize,
    modelName: 'Disciplina',
    tableName: 'disciplina',
    timestamps: false,
  }
);