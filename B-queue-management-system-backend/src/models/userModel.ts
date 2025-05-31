import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: string;
  public fullName!: string;
}

User.init(
  {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'customer' },
    fullName: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: 'User' }
);

export default User;