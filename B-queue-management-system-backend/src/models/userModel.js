"use strict";
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class User extends Model {}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'customer',
      validate: {
        isIn: [['admin', 'staff', 'customer']], // Enum validation
      },
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // Pass the Sequelize instance
    modelName: 'User', // Name of the model
    tableName: 'users', // Optional: specify table name
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = { User };
