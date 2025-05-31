import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import queueRoutes from './routes/queueRoutes';
import ticketRoutes from './routes/ticketRoutes';
import { errorHandler } from './middlewares/errorHandler';
import servicesRoutes from './routes/servicesRoutes';
import { sequelize } from './config/database';
import { User } from './models/userModel';
import { Ticket } from './models/ticketModel';
import countersRoutes from './routes/countersRoutes';

// Sync database
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
});

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/tickets', ticketRoutes);



app.use('/api/counters', countersRoutes);


app.use('/api/services', servicesRoutes); // <-- add this with your other routes

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});