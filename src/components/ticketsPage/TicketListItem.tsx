import { Calendar, MapPin, ArrowRight, Heart, Ticket as TicketIcon, Users } from "lucide-react"
import { FrontendTicket } from "../../pages/Tickets"

interface TicketListItemProps {
  ticket: FrontendTicket
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onBuyTicketClick: (ticket: FrontendTicket) => void
  formatDateForCard: (isoDateString?: string) => string
}

export const TicketListItem = ({
  ticket,
  isFavorite,
  onToggleFavorite,
  onBuyTicketClick,
  formatDateForCard,
}: TicketListItemProps) => {
  return (
    <div className="bg-white overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-blue-50 group flex flex-col md:flex-row">
      <div className="relative md:w-1/3 lg:w-1/4 h-60 md:h-auto">
        <img
          src={ticket.image}
          alt={ticket.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r"></div>
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 rounded-lg">
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

      <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between md:w-2/3 lg:w-3/4">
        <div>
          <h3 className="text-xl lg:text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
            {ticket.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-1 text-sm">
            <Calendar className="h-4 w-4 mr-2 text-blue-500 shrink-0" />
            <span>{formatDateForCard(ticket.originalEvent.startDate)}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-3 text-sm">
            <MapPin className="h-4 w-4 mr-2 text-blue-500 shrink-0" />
            <span>{ticket.location}</span>
          </div>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {ticket.originalEvent.description || "No description available."}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {ticket.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">{tag}</span>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
           <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Users className="h-4 w-4 text-blue-500" />
            <span>{ticket.attendees} attending</span>
            <TicketIcon className="h-4 w-4 text-green-500" />
            <span>{ticket.remaining > 0 ? `${ticket.remaining} left` : 'Sold Out'}</span>
          </div>
          <button
            onClick={() => onBuyTicketClick(ticket)}
            className="w-full sm:w-auto py-2.5 px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium flex items-center justify-center text-sm"
          >
            <TicketIcon className="mr-2 h-4 w-4" />
            View Tiers
            <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </div>
  )
}