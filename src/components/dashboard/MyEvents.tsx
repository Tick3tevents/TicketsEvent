"use client"

import { Calendar, MapPin, Users } from "lucide-react"

interface MyEventsProps {
  onEventSelect: (eventId: string) => void
}

export default function MyEvents({ onEventSelect }: MyEventsProps) {
  // Mock data for events
  const events = [
    {
      id: "1",
      name: "Solana Summer Hackathon",
      image: "/tech-conference.png",
      date: "Aug 15, 2023",
      location: "San Francisco, CA",
      status: "published",
      ticketsSold: 450,
      totalCapacity: 500,
      revenue: "135 SOL",
    },
    {
      id: "2",
      name: "NFT Gallery Opening",
      image: "/art-exhibition.png",
      date: "Jul 28, 2023",
      location: "New York, NY",
      status: "ended",
      ticketsSold: 320,
      totalCapacity: 350,
      revenue: "96 SOL",
    },
    {
      id: "3",
      name: "Crypto Conference 2023",
      image: "/blockchain-summit.png",
      date: "Sep 5, 2023",
      location: "Miami, FL",
      status: "published",
      ticketsSold: 280,
      totalCapacity: 400,
      revenue: "84 SOL",
    },
    {
      id: "4",
      name: "DeFi Summit",
      image: "/finance-conference.png",
      date: "Oct 12, 2023",
      location: "London, UK",
      status: "draft",
      ticketsSold: 0,
      totalCapacity: 300,
      revenue: "0 SOL",
    },
    {
      id: "5",
      name: "Web3 Gaming Expo",
      image: "/gaming-expo.png",
      date: "Nov 5, 2023",
      location: "Tokyo, Japan",
      status: "draft",
      ticketsSold: 0,
      totalCapacity: 250,
      revenue: "0 SOL",
    },
  ]

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "ended":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Events</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your created events</p>
        </div>
        <a
          href="/new-event"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-center sm:text-left"
        >
          Create New Event
        </a>
      </div>

      {/* Filter/Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-2">
          <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium">All Events</button>
          <button className="text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
            Published
          </button>
          <button className="text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
            Drafts
          </button>
          <button className="text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
            Ended
          </button>
        </div>
        <div className="w-full sm:w-auto">
          <select className="bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-1.5 w-full sm:w-auto">
            <option>Sort by: Newest</option>
            <option>Sort by: Oldest</option>
            <option>Sort by: Most Sales</option>
            <option>Sort by: Upcoming</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-40 sm:h-48">
              <img src={event.image || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <span className={`${getStatusColor(event.status)} text-xs font-medium px-2.5 py-1 rounded-full`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{event.name}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                  <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>
                    {event.ticketsSold} / {event.totalCapacity} tickets sold
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Revenue</p>
                  <p className="font-semibold text-gray-900">{event.revenue}</p>
                </div>
                <button
                  onClick={() => onEventSelect(event.id)}
                  className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
