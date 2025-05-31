import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface TicketAttributes {
  id?: number;
  ticketNumber: number;
  status: string;
  customerName: string;
  serviceId: number;
  userId?: number | null;
  counterId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  scannedAt?: Date | null;
  servedAt?: Date | null;
  completedAt?: Date | null;
  expiresAt?: Date | null;
}

interface TicketCreationAttributes extends Optional<TicketAttributes, 'id'> {}

export class Ticket extends Model<TicketAttributes, TicketCreationAttributes>
  implements TicketAttributes {
  public id!: number;
  public ticketNumber!: number;
  public status!: string;
  public customerName!: string;
  public serviceId!: number;
  public userId?: number | null;
  public counterId?: number | null;
  public createdAt?: Date;
  public updatedAt?: Date;
  public scannedAt?: Date | null;
  public servedAt?: Date | null;
  public completedAt?: Date | null;
  public expiresAt?: Date | null;
}

Ticket.init(
  {
    ticketNumber: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
    customerName: { type: DataTypes.STRING, allowNull: false },
    serviceId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    counterId: { type: DataTypes.INTEGER, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    scannedAt: { type: DataTypes.DATE, allowNull: true },
    servedAt: { type: DataTypes.DATE, allowNull: true },
    completedAt: { type: DataTypes.DATE, allowNull: true },
    expiresAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'Ticket', timestamps: true }
);

export default Ticket;