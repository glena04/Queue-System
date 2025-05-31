
type Counter = {
  id: number;
  name: string;
  userId: number;
  serviceId?: number;
  // Add other fields if needed
};

type Service = {
  id: number;
  name: string;
  // ...other fields
};

type Ticket = {
  id: number;
  ticketNumber: string;
  customerName: string;
  status: string;
  serviceId: number;
  scannedAt?: string;
  // ...other fields
};


import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { AuthState } from '../../store/slices/authSlice';
import { 
  fetchCounters, 
  updateCounter, 

  assignServiceToCounter 
} from '../../store/slices/countersSlice';
import { 
  fetchServices,

} from '../../store/slices/servicesSlice';
import { 
  fetchTickets, 
  callNextTicket, 
  completeTicket, 
 
} from '../../store/slices/ticketsSlice';

const CounterInterface: React.FC = () => {
  const dispatch = useAppDispatch();
const counters = useAppSelector((state) => state.counters.counters) as Counter[];
const services = useAppSelector((state) => state.services.services) as Service[];
const tickets = useAppSelector((state) => state.tickets.tickets) as Ticket[];
  const currentTicket = useAppSelector((state) => state.tickets.currentTicket);
  const auth = useAppSelector((state) => state.auth) as AuthState;

  // State for the counter
  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);

// Fetch data only once on mount
useEffect(() => {
  dispatch(fetchCounters());
  dispatch(fetchServices());
  dispatch(fetchTickets());
}, [dispatch]);

// Set selected counter/service when user or counters change
useEffect(() => {
  if (auth.user) {
    const staffCounter = counters.find(counter => counter.userId === auth.user?.id);
    if (staffCounter) {
      setSelectedCounter(staffCounter);
      if (staffCounter.serviceId) {
        setSelectedService(staffCounter.serviceId);
      }
    }
  }
}, [auth.user, counters]);

  // Handle service selection change
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = parseInt(e.target.value);
    setSelectedService(serviceId);
    
    if (selectedCounter) {
      dispatch(assignServiceToCounter({ 
        counterId: selectedCounter.id, 
        serviceId 
      }));
    }
  };

  // Handle counter selection change
  const handleCounterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const counterId = parseInt(e.target.value);
    const counter = counters.find(c => c.id === counterId) || null;
    setSelectedCounter(counter);
    
    if (counter && counter.serviceId) {
      setSelectedService(counter.serviceId);
    } else {
      setSelectedService(null);
    }
  };

  // Call the next customer in the queue
  const handleCallNext = () => {
    if (selectedCounter && selectedService) {
      dispatch(callNextTicket({ 
        counterId: selectedCounter.id, 
        serviceId: selectedService 
      }));
    }
  };

  // Complete the current service
  const handleCompleteService = () => {
    if (currentTicket) {
      dispatch(completeTicket(currentTicket.id));
    }
  };

  // Get waiting tickets for the selected service
  const getWaitingTickets = (): Ticket[] => {
    if (!selectedService) return [];
    
    return tickets.filter(
      ticket => 
        ticket.serviceId === selectedService && 
        (ticket.status === 'waiting' || ticket.status === 'pending')
    ).sort((a, b) => {
      // Sort by status (waiting first, then pending) and then by ticket number
      if (a.status === 'waiting' && b.status === 'pending') return -1;
      if (a.status === 'pending' && b.status === 'waiting') return 1;
      return parseInt(a.ticketNumber) - parseInt(b.ticketNumber);
    });
  };

  const waitingTickets = getWaitingTickets();

  return (
    <div className="counter-interface">
      <h1>Counter Interface</h1>
      
      <div className="counter-selection">
        <h2>Counter Settings</h2>
        <div className="form-group">
          <label htmlFor="counter-select">Select Counter:</label>
          <select 
            id="counter-select" 
            value={selectedCounter?.id || ''} 
            onChange={handleCounterChange}
          >
            <option value="">Select Counter</option>
            {counters.map(counter => (
              <option key={counter.id} value={counter.id}>
                {counter.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="service-select">Select Service:</label>
          <select 
            id="service-select" 
            value={selectedService || ''} 
            onChange={handleServiceChange}
            disabled={!selectedCounter}
          >
            <option value="">Select Service</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="current-ticket">
        <h2>Current Ticket</h2>
        {currentTicket ? (
          <div className="ticket-card serving">
            <div className="ticket-number">#{currentTicket.ticketNumber}</div>
            <div className="ticket-details">
              <p><strong>Customer:</strong> {currentTicket.customerName}</p>
              <p><strong>Status:</strong> {currentTicket.status}</p>
              <p><strong>Service:</strong> {
                services.find(s => s.id === currentTicket.serviceId)?.name || 'Unknown'
              }</p>
            </div>
            <button 
              className="complete-button"
              onClick={handleCompleteService}
            >
              Complete Service
            </button>
          </div>
        ) : (
          <p>No customer is currently being served.</p>
        )}
        
        <button 
          className="call-next-button" 
          onClick={handleCallNext}
          disabled={!selectedCounter || !selectedService || waitingTickets.length === 0}
        >
          Call Next Customer
        </button>
      </div>
      
      <div className="waiting-list">
        <h2>Waiting List</h2>
        {waitingTickets.length === 0 ? (
          <p>No customers waiting for this service.</p>
        ) : (
          <div className="ticket-list">
            {waitingTickets.map(ticket => (
              <div key={ticket.id} className={`ticket-card ${ticket.status}`}>
                <div className="ticket-number">#{ticket.ticketNumber}</div>
                <div className="ticket-details">
                  <p><strong>Customer:</strong> {ticket.customerName}</p>
                  <p><strong>Status:</strong> {ticket.status}</p>
                  <p><strong>Arrived:</strong> {ticket.scannedAt ? 'Yes' : 'No'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CounterInterface;