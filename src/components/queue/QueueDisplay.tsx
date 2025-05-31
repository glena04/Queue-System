import React from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';

const QueueDisplay: React.FC = () => {
  // Access the tickets from the Redux store
  const tickets = useAppSelector((state) => state.tickets.tickets);

  return (
    <div>
      <h1>Queue Display</h1>
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
    </div>
  );
};

export default QueueDisplay;