"use client"

import { Calendar, MapPin, ArrowRight, Heart, Ticket } from "lucide-react"
import { FrontendTicket } from "../../pages/Tickets"

interface TicketCardProps {
  ticket: FrontendTicket
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onBuyTicketClick: (ticket: FrontendTicket) => void
  formatDateForCard: (isoDateString?: string) => string
}

export const TicketCard = ({ ticket, isFavorite, onToggleFavorite, onBuyTicketClick, formatDateForCard }: TicketCardProps) => {
  return (
    <div className="bg-white overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-blue-50 group ticket-card relative">
      <div className="relative h-48">
        <img
          src={ticket.image}
          alt={ticket.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-lg">
          {ticket.price}
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold px-3 py-1 rounded-lg">
            {ticket.category}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            onToggleFavorite(ticket.id)
          }}
          className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg text-gray-600 hover:text-red-500 transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          ) : (
            <Heart className="h-4 w-4" />
          )}
        </button>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
          {ticket.title}
        </h3>
        <div className="flex items-center text-gray-600 mb-1">
          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
          <span className="text-sm">{formatDateForCard(ticket.originalEvent.startDate)}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-2 text-blue-500" />
          <span className="text-sm">{ticket.location}</span>
        </div>
        <button
          onClick={() => onBuyTicketClick(ticket)}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium flex items-center justify-center"
        >
          <Ticket className="mr-2 h-4 w-4" />
          View Tiers
          <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </div>
  )
}