import express from 'express';
import { 
  createTicket, 
  getAllTickets, 
  getUserTickets, 
  activateTicket,
  callNextTicket
} from '../controllers/ticketController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllTickets);

// Protected routes - require authentication
router.post('/',  createTicket);
router.get('/user',  getUserTickets);
router.put('/:id/activate',  activateTicket);
router.post('/next', callNextTicket as express.RequestHandler);
export default router;