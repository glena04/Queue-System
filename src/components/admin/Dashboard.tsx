import React from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';

const Dashboard: React.FC = () => {
  // Access services and tickets from the Redux store
  const services = useAppSelector((state) => state.services.services);
  const tickets = useAppSelector((state) => state.tickets.tickets);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <section>
        <h2>Services Overview</h2>
        {services.length === 0 ? (
          <p>No services available.</p>
        ) : (
          <ul>
            {services.map((service) => (
              <li key={service.id}>
                <strong>{service.name}</strong>: {service.description}
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2>Tickets Overview</h2>
        {tickets.length === 0 ? (
          <p>No tickets in the queue.</p>
        ) : (
          <ul>
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <strong>Ticket ID:</strong> {ticket.id} - <strong>Name:</strong> {ticket.ticketNumber}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;