import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  return (
    <Link to={`/event/${event.id}`} className="block p-4 bg-white shadow rounded-lg hover:shadow-lg transition">
      <h2 className="text-2xl font-semibold">{event.title}</h2>
      <p className="text-gray-500">{event.date}</p>
    </Link>
  );
}
