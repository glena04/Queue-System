import express, { Router, RequestHandler } from 'express';
import { createService, getServices, deleteService } from '../controllers/servicesController';

const router: Router = express.Router();

// Use explicit casting to RequestHandler to help TypeScript understand the types
router.post('/', createService as RequestHandler);
router.get('/', getServices as RequestHandler);
router.delete('/:id', deleteService as RequestHandler);

export default router;