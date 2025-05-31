"use strict";
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Ticket extends Model {}

Ticket.init(
  {
    ticketNumber: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    status: { 
      type: DataTypes.STRING, 
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'waiting', 'serving', 'served', 'expired', 'no-show']]
      }
    },
    customerName: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    serviceId: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    userId: { 
      type: DataTypes.INTEGER, 
      allowNull: true 
    },
    counterId: { 
      type: DataTypes.INTEGER, 
      allowNull: true 
    },
    createdAt: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
    updatedAt: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
    scannedAt: { 
      type: DataTypes.DATE, 
      allowNull: true 
    },
    servedAt: { 
      type: DataTypes.DATE, 
      allowNull: true 
    },
    completedAt: { 
      type: DataTypes.DATE, 
      allowNull: true 
    },
    expiresAt: { 
      type: DataTypes.DATE, 
      allowNull: true 
    }
  },
  {
    sequelize,
    modelName: 'Ticket',
    timestamps: true // Enable timestamps for updatedAt
  }
);

module.exports = { Ticket };
