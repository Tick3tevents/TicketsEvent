import EventCard from '../components/EventCard';

const events = [
  { id: 1, title: 'Концерт Imagine Dragons', date: '2025-06-12' },
  { id: 2, title: 'Фестиваль NFT Art', date: '2025-07-20' }
];

export default function Home() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map(event => <EventCard key={event.id} event={event} />)}
    </div>
  );
}
