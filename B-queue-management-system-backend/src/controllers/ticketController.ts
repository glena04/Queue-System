import { Request, Response } from 'express';
import { Ticket } from '../models/ticketModel';
import { JwtPayload } from 'jsonwebtoken';

/**
 * Helper function to safely extract user ID from request
 */
const extractUserId = (req: Request): number | undefined => {
  try {
    if (typeof req.user === 'object' && req.user !== null) {
      const payload = req.user as JwtPayload;
      if (typeof payload.id === 'number') {
        return payload.id;
      } else if (typeof payload.id === 'string') {
        return parseInt(payload.id, 10);
      }
    }
    return undefined;
  } catch (error) {
    console.error('Error extracting user ID:', error);
    return undefined;
  }
};

// Create a new ticket
export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, serviceId } = req.body;
    const userId = extractUserId(req);

    console.log('Create ticket request:', { customerName, serviceId, userId });

    if (!customerName || !serviceId) {
      res.status(400).json({ message: 'customerName and serviceId are required' });
      return;
    }

    // Find the last ticket number for this service
    const lastTicket = await Ticket.findOne({
      where: { serviceId },
      order: [['ticketNumber', 'DESC']],
    });

    // Safely handle ticket number generation
    let nextTicketNumber = 1;
    if (lastTicket) {
      const lastNumber = lastTicket.get('ticketNumber');
      if (typeof lastNumber === 'number') {
        nextTicketNumber = lastNumber + 1;
      } else if (typeof lastNumber === 'string') {
        nextTicketNumber = parseInt(lastNumber, 10) + 1;
      }
    }

    console.log('Generated next ticket number:', nextTicketNumber);

    const ticketData = {
      ticketNumber: nextTicketNumber,
      status: 'pending',
      customerName,
      serviceId,
      userId, // May be undefined if user not authenticated
    };

    console.log('Creating ticket with data:', ticketData);
    const ticket = await Ticket.create(ticketData);

    res.status(201).json(ticket);
  } catch (error: any) {
    console.error('Error in createTicket:', error);
    res.status(500).json({ message: 'Failed to create ticket', error: error.message });
  }
};

// Get all tickets
export const getAllTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (error: any) {
    console.error('Error in getAllTickets:', error);
    res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
  }
};

// Get user tickets - only returns tickets associated with the authenticated user
export const getUserTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = extractUserId(req);

    console.log('Getting tickets for user ID:', userId);

    if (!userId) {
      res.status(400).json({ message: 'User ID not found in token or invalid format' });
      return;
    }

    const tickets = await Ticket.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    console.log(`Found ${tickets.length} tickets for user ${userId}`);
    res.json(tickets);
  } catch (error: any) {
    console.error('Error in getUserTickets:', error);
    res.status(500).json({ message: 'Failed to fetch user tickets', error: error.message });
  }
};

// Activate a ticket (customer has arrived)
export const activateTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = extractUserId(req);

    console.log(`Activating ticket ${id} for user ${userId}`);

    if (!id) {
      res.status(400).json({ message: 'Ticket ID is required' });
      return;
    }

    const ticketId = parseInt(id, 10);
    if (isNaN(ticketId)) {
      res.status(400).json({ message: 'Invalid ticket ID format' });
      return;
    }

    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    // Check if the ticket belongs to the authenticated user
    const ticketUserId = ticket.get('userId');
    if (userId && ticketUserId && ticketUserId !== userId) {
      res.status(403).json({ message: 'You can only activate your own tickets' });
      return;
    }

    ticket.set('status', 'waiting');
    ticket.set('scannedAt', new Date());
    await ticket.save();

    console.log(`Ticket ${id} activated successfully`);
    res.json(ticket);
  } catch (error: any) {
    console.error('Error in activateTicket:', error);
    res.status(500).json({ message: 'Failed to activate ticket', error: error.message });
  }
};

export const callNextTicket = async (req: Request, res: Response) => {
  const { counterId, serviceId } = req.body;
  try {
    // Find the next pending ticket for the service
    const ticket = await Ticket.findOne({
      where: { serviceId, status: 'waiting' },
      order: [['createdAt', 'ASC']],
    });
    const tickets = await Ticket.findAll({
    });
    console.log('All tickets:', tickets);
    if (!ticket) return res.status(404).json({ message: 'No pending tickets' });
    ticket.status = 'serving';
    ticket.counterId = counterId;
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to call next ticket', error });
  }
};



