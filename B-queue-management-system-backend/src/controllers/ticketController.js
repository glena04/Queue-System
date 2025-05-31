const { Ticket } = require('../models/ticketModel');

// Create a new ticket
exports.createTicket = async (req, res) => {
  try {
    const { customerName, serviceId } = req.body;
    // Extract userId from the authenticated user
    const userId = req.user?.id;

    if (!customerName || !serviceId) {
      return res.status(400).json({ message: 'customerName and serviceId are required' });
    }

    // Find the last ticket number for this service
    const lastTicket = await Ticket.findOne({
      where: { serviceId },
      order: [['ticketNumber', 'DESC']],
    });
    const nextTicketNumber = lastTicket ? lastTicket.ticketNumber + 1 : 1;

    const ticket = await Ticket.create({
      ticketNumber: nextTicketNumber,
      status: 'pending',
      customerName,
      serviceId,
      userId, // Include the userId when creating the ticket
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Failed to create ticket', error: error.message });
  }
};

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
  }
};

// Get user tickets - only returns tickets associated with the authenticated user
exports.getUserTickets = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }
    
    const tickets = await Ticket.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(500).json({ message: 'Failed to fetch user tickets', error: error.message });
  }
};

// Activate a ticket (customer has arrived)
exports.activateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const ticket = await Ticket.findByPk(parseInt(id));
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check if the ticket belongs to the authenticated user
    if (userId && ticket.userId !== userId) {
      return res.status(403).json({ message: 'You can only activate your own tickets' });
    }
    
    ticket.status = 'waiting';
    ticket.scannedAt = new Date();
    await ticket.save();
    
    res.json(ticket);
  } catch (error) {
    console.error('Error activating ticket:', error);
    res.status(500).json({ message: 'Failed to activate ticket', error: error.message });
  }
};
