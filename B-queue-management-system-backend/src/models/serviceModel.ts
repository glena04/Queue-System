import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ServiceAttributes {
  id: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ServiceCreationAttributes extends Optional<ServiceAttributes, 'id'> {}

export class Service extends Model<ServiceAttributes, ServiceCreationAttributes>
  implements ServiceAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Service.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Service',
    tableName: 'services',
    timestamps: true,
  }
);


export default Service;