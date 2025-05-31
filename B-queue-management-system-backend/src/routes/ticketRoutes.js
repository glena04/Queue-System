const express = require('express');
const { 
  createTicket, 
  getAllTickets, 
  getUserTickets, 
  activateTicket 
} = require('../controllers/ticketController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllTickets);

// Protected routes - require authentication
router.post('/', authMiddleware, createTicket);
router.get('/user', authMiddleware, getUserTickets);
router.put('/:id/activate', authMiddleware, activateTicket);

module.exports = router;