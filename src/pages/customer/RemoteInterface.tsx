import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchServices } from '../../store/slices/servicesSlice';
import { 
  fetchTickets, 
  createTicket, 
  activateTicket, 
  fetchUserTickets,
  Ticket 
} from '../../store/slices/ticketsSlice';
import { fetchCounters } from '../../store/slices/countersSlice';

const RemoteInterface: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const services = useAppSelector((state) => state.services.services);
  const tickets = useAppSelector((state) => state.tickets.tickets);
  const counters = useAppSelector((state) => state.counters.counters);
  const error = useAppSelector((state) => state.tickets.error);
  const loading = useAppSelector((state) => state.tickets.loading);
  
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [myTicket, setMyTicket] = useState<Ticket | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchUserTickets()); // Fetch only the authenticated user's tickets
    dispatch(fetchCounters());
  }, [dispatch]);

  // Set the user's latest ticket as the active one
  useEffect(() => {
    if (tickets.length > 0) {
      // Find the most recent ticket
      const sortedTickets = [...tickets].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // Set the most recent active ticket (non-served status)
      const activeTicket = sortedTickets.find(t => 
        t.status === 'pending' || t.status === 'waiting' || t.status === 'serving'
      );
      
      if (activeTicket) {
        setMyTicket(activeTicket);
        // Set default selected service based on this ticket
        setSelectedService(activeTicket.serviceId);
      }
    }
  }, [tickets]);

  // Pre-fill customer name from the user's account
  useEffect(() => {
    if (user && user.name) {
      setCustomerName(user.name);
    }
  }, [user]);

  // Request a new ticket
  const handleRequestTicket = () => {
    setRequestError(null); // Clear any previous errors
    
    if (selectedService !== null && customerName.trim() !== '') {
      dispatch(createTicket({
        serviceId: selectedService,
        customerName: customerName.trim()
      })).then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          setMyTicket(action.payload);
          // Reset form fields
          setCustomerPhone('');
          setSelectedService(null);
        } else if (action.meta.requestStatus === 'rejected') {
          // Display the error to the user
          setRequestError(action.payload as string || 'Failed to create ticket. Please try again.');
          console.error('Failed to create ticket:', action.payload);
        }
      }).catch(err => {
        setRequestError('An unexpected error occurred. Please try again.');
        console.error('Error creating ticket:', err);
      });
    } else {
      setRequestError('Please select a service and enter your name.');
    }
  };

  // Activate the ticket upon arrival
  const handleActivateTicket = () => {
    if (myTicket) {
      dispatch(activateTicket(myTicket.id)).then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          setMyTicket(action.payload);
        }
      });
    }
  };

  // Clear the current ticket selection (doesn't delete the ticket)
  const handleClearTicket = () => {
    setMyTicket(null);
  };

  // Calculate queue status information
  const getQueueStatus = () => {
    if (!myTicket) return null;
    
    // Find tickets for the same service
    const serviceTickets = tickets.filter(t => t.serviceId === myTicket.serviceId);
    
    // Count people ahead (waiting tickets with lower numbers)
    const peopleAhead = serviceTickets.filter(t => 
      (t.status === 'waiting' || t.status === 'pending') && 
      parseInt(t.ticketNumber) < parseInt(myTicket.ticketNumber)
    ).length;
    
    // Find current ticket being served for this service
    const currentServiceCounter = counters.find(c => c.serviceId === myTicket.serviceId);
    const currentTicket = currentServiceCounter?.currentTicket || 'None';
    
    // Calculate estimated wait time (average service time * people ahead)
    const selectedServiceData = services.find(s => s.id === myTicket.serviceId);
    const avgServiceTime = selectedServiceData?.averageServiceTime || 5; // Default to 5 min
    const estimatedWaitTime = peopleAhead * avgServiceTime;
    
    return {
      peopleAhead,
      currentTicket,
      estimatedWaitTime
    };
  };

  const queueStatus = myTicket ? getQueueStatus() : null;

  return (
    <div className="remote-interface">
      <h1>Queue Management System</h1>
      <h2>Welcome, {user?.name || 'Customer'}</h2>
      
      {!myTicket ? (
        <div className="ticket-request-form">
          <h2>Request a Queue Number</h2>
          
          {requestError && (
            <div className="error-message" style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffeeee', borderRadius: '4px' }}>
              {requestError}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="service-select">Select Service:</label>
            <select 
              id="service-select" 
              value={selectedService || ''} 
              onChange={(e) => setSelectedService(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">Select a Service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.description}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="customer-name">Your Name:</label>
            <input
              id="customer-name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="customer-phone">Phone Number (optional):</label>
            <input
              id="customer-phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          
          <button 
            className="request-button"
            onClick={handleRequestTicket}
            disabled={!selectedService || !customerName.trim() || loading}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Processing...' : 'Request Queue Number'}
          </button>
        </div>
      ) : (
        <div className="my-ticket">
          <h2>Your Queue Information</h2>
          <div className="ticket-card">
            <div className="ticket-number">#{myTicket.ticketNumber}</div>
            <div className="ticket-details">
              <p><strong>Service:</strong> {
                services.find(s => s.id === myTicket.serviceId)?.name || 'Unknown'
              }</p>
              <p><strong>Status:</strong> {myTicket.status}</p>
              <p><strong>Created:</strong> {new Date(myTicket.createdAt).toLocaleString()}</p>
              
              {queueStatus && (
                <div className="queue-status">
                  <p><strong>People Ahead:</strong> {queueStatus.peopleAhead}</p>
                  <p><strong>Current Number:</strong> {queueStatus.currentTicket}</p>
                  <p><strong>Estimated Wait:</strong> ~{queueStatus.estimatedWaitTime} minutes</p>
                </div>
              )}
            </div>
            
            {myTicket.status === 'pending' && (
              <button 
                className="activate-button"
                onClick={handleActivateTicket}
              >
                I'm Here (Activate Ticket)
              </button>
            )}
            
            <button 
              className="clear-button"
              onClick={handleClearTicket}
            >
              Clear Ticket
            </button>
          </div>
        </div>
      )}
      
      <div className="service-status">
        <h2>Current Queue Status</h2>
        <div className="service-cards">
          {services.map(service => {
            // Find counter for this service
            const serviceCounter = counters.find(c => c.serviceId === service.id);
            // Find waiting count for this service
            const waitingCount = tickets.filter(t => 
              t.serviceId === service.id && 
              (t.status === 'waiting' || t.status === 'pending')
            ).length;
            
            return (
              <div key={service.id} className="service-card">
                <h3>{service.name}</h3>
                <p><strong>Currently Serving:</strong> {serviceCounter?.currentTicket || 'None'}</p>
                <p><strong>Waiting:</strong> {waitingCount}</p>
                <p><strong>Avg. Wait Time:</strong> ~{service.averageServiceTime || 5} min/customer</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RemoteInterface;