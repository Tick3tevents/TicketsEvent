import React from 'react';
export default function TicketCard({ ticket }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-700 shadow rounded-lg">
      <h3 className="font-bold">{ticket.eventName}</h3>
      <p>Статус: {ticket.status}</p>
    </div>
  );
}
