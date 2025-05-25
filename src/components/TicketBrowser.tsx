"use client"

import { useState } from "react"
import { Search, Calendar, MapPin, ArrowRight } from "lucide-react"

// Mock data for tickets
const MOCK_TICKETS = [
  {
    id: 1,
    title: "Solana Summer Hackathon",
    date: "June 15-17, 2023",
    location: "San Francisco, CA",
    image: "/placeholder.svg?height=400&width=600",
    price: "0.5 SOL",
    category: "Tech",
    featured: true,
  },
  {
    id: 2,
    title: "Web3 Music Festival",
    date: "July 22-24, 2023",
    location: "Miami, FL",
    image: "/placeholder.svg?height=400&width=600",
    price: "1.2 SOL",
    category: "Music",
    featured: false,
  },
  {
    id: 3,
    title: "NFT Art Exhibition",
    date: "August 5-7, 2023",
    location: "New York, NY",
    image: "/placeholder.svg?height=400&width=600",
    price: "0.8 SOL",
    category: "Art",
    featured: false,
  },
  {
    id: 4,
    title: "DeFi Conference 2023",
    date: "September 10-12, 2023",
    location: "London, UK",
    image: "/placeholder.svg?height=400&width=600",
    price: "1.5 SOL",
    category: "Finance",
    featured: false,
  },
]

const TicketBrowser = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = ["All", "Tech", "Music", "Art", "Finance"]

  const filteredTickets = MOCK_TICKETS.filter(
    (ticket) =>
      (activeCategory === "All" || ticket.category === activeCategory) &&
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const featuredEvent = MOCK_TICKETS.find((ticket) => ticket.featured)

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50 relative" id="browse-tickets">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>

        {/* Ticket patterns - subtle background */}
        <svg width="100%" height="100%" className="absolute inset-0 opacity-5">
          <pattern id="browser-ticket-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M15 0H45C52.5228 0 60 7.47715 60 15V45C60 52.5228 52.5228 60 45 60H15C7.47715 60 0 52.5228 0 45V15C0 7.47715 7.47715 0 15 0Z"
              stroke="#3B82F6"
              strokeWidth="1"
              fill="none"
            />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#browser-ticket-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-bold mb-6">
            DISCOVER EVENTS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
            Upcoming Events
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mt-6 mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and secure your spot at exclusive events with NFT tickets
          </p>
        </div>

        {/* Featured Event */}
        {featuredEvent && (
          <div className="mb-16 bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <img
                  src={featuredEvent.image || "/placeholder.svg"}
                  alt={featuredEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                  FEATURED EVENT
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="text-blue-600 font-bold mb-2">{featuredEvent.category}</div>
                <h3 className="text-3xl font-bold mb-4">{featuredEvent.title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{featuredEvent.date}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{featuredEvent.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">{featuredEvent.price}</div>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center hover:bg-blue-700 transition-colors duration-300">
                    View Details
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative max-w-md mx-auto mb-12">
          <div className="absolute inset-0 bg-blue-200 blur-md opacity-30 rounded-full transform -rotate-1"></div>
          <div className="relative bg-white rounded-full shadow-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-12 pr-4 py-4 bg-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center mb-12 space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-blue-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTickets
            .filter((ticket) => !ticket.featured)
            .map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-50 group"
              >
                <div className="relative h-48">
                  <img
                    src={ticket.image || "/placeholder.svg"}
                    alt={ticket.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full shadow-lg">
                    {ticket.price}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                    {ticket.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {ticket.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm">{ticket.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm">{ticket.location}</span>
                  </div>
                  <button className="w-full py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-300 font-medium flex items-center justify-center">
                    View Event
                    <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="/tickets"
            className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 font-medium text-lg inline-flex items-center"
          >
            View All Events
            <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default TicketBrowser
