import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Path to SQLite database file
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite Database Connected');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};