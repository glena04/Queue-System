import express from 'express';
import { createCounter, getCounters, deleteCounter, assignServiceToCounter} from '../controllers/countersController';

const router = express.Router();

router.post('/', createCounter as express.RequestHandler);
router.get('/', getCounters);
router.delete('/:id', deleteCounter);
router.put('/:id/assign-service', assignServiceToCounter as express.RequestHandler);
export default router;