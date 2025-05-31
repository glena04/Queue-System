import { Request, Response } from 'express';
import { Ticket } from '../models/ticketModel';

export const getQueue = async (req: Request, res: Response) => {
  const tickets = await Ticket.findAll();
  res.json(tickets);
};