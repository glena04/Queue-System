// filepath: h:\MolkDev\AllProgramms\Queue System\Queue System React\queue-management-system-1\B-queue-management-system-backend\src\config\database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Path to SQLite database file
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('SQLite Database Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
