import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export class Alternativa extends Model {}

Alternativa.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    texto: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    is_correta: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    id_pergunta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pergunta',
        key: 'id',
      },
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Alternativa',
    tableName: 'alternativa',
    timestamps: false,
  }
);