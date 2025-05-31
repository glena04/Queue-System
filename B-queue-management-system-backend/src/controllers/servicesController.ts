import { Request, Response } from 'express';
import Service from '../models/serviceModel';

// Create a new service
export const createService = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Service name is required' });
    }
    const service = await Service.create({ name, description });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create service', error });
  }
};

// Get all services
export const getServices = async (_req: Request, res: Response) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services', error });
  }
};

// Delete a service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Service.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Service deleted' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete service', error });
  }
};