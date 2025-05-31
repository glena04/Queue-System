import { Request, Response } from 'express';
import Counter from '../models/counterModel';

export const createCounter = async (req: Request, res: Response) => {
  try {
    const { name, userId, serviceId } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Counter name is required' });
    }
    const counter = await Counter.create({ name, userId, serviceId });
    res.status(201).json(counter);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create counter', error });
  }
};

export const getCounters = async (_req: Request, res: Response) => {
  try {
    const counters = await Counter.findAll();
    res.json(counters);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch counters', error });
  }
};

export const deleteCounter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Counter.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Counter deleted' });
    } else {
      res.status(404).json({ message: 'Counter not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete counter', error });
  }
};


export const assignServiceToCounter = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { serviceId } = req.body;
  try {
    const counter = await Counter.findByPk(id);
    if (!counter) return res.status(404).json({ message: 'Counter not found' });
    counter.serviceId = serviceId;
    await counter.save();
    res.json(counter);
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign service', error });
  }
};