export default function TicketCard({ ticket }) {
    return (
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="font-bold">{ticket.eventName}</h3>
        <p>Статус: {ticket.status}</p>
      </div>
    );
  }