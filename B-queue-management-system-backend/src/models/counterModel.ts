import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface CounterAttributes {
  id: number;
  name: string;
  userId?: number;
  serviceId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CounterCreationAttributes extends Optional<CounterAttributes, 'id'> {}

export class Counter extends Model<CounterAttributes, CounterCreationAttributes>
  implements CounterAttributes {
  public id!: number;
  public name!: string;
  public userId?: number;
  public serviceId?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Counter.init(
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    serviceId: {
      type: DataTypes.INTEGER,
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
    modelName: 'Counter',
    tableName: 'counters',
    timestamps: true,
  }
);

export default Counter;