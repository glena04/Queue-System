import React from 'react';
import useAppSelector from '../../hooks/useAppSelector';

const TicketCard: React.FC = () => {
const tickets = useAppSelector((state) => state.queue.tickets);

  return (
    <div>
      {tickets.map((ticket) => (
        <div key={ticket.id}>
          <h3>{ticket.id}</h3>
        </div>
      ))}
    </div>
  );
};

export default TicketCard;