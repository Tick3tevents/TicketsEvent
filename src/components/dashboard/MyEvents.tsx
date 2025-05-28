"use client"

import { useEffect, useState } from "react"
import { Calendar, MapPin, Users, AlertTriangle, Loader2 } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"; // Assuming this is your wallet hook

interface IEventFromAPI {
  _id: string;
  title: string;
  bannerImage?: string;
  startDate: string;
  startTime: string;
  location: string;
  status: 'draft' | 'published' | 'ended' | 'cancelled';
  totalTicketsSold: number;
  totalCapacity: number;
  totalRevenueSOL: number;
  organizerWalletAddress: string;
  description: string;
  category: string;
  locationType: 'physical' | 'virtual';
  endDate?: string;
  endTime?: string;
  logoImage?: string;
  defaultRoyaltyPercent: number;
  allowResale: boolean;
  useWhitelist: boolean;
  previewMode: boolean;
  totalRoyaltiesEarnedSOL: number;
  totalAttendeesCheckedIn: number;
  ticketTiers: {
    name: string;
    priceSOL: number;
    supply: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface MyEventsProps {
  onEventSelect: (eventId: string) => void;
}

export default function MyEvents({ onEventSelect }: MyEventsProps) {
  const [events, setEvents] = useState<IEventFromAPI[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { publicKey, connected } = useWallet(); // Get publicKey and connection status

  const organizerWalletAddress = publicKey?.toBase58();

  useEffect(() => {
    if (!connected) {
      setError("Please connect your wallet to see your events.");
      setIsLoading(false);
      setEvents([]);
      return;
    }

    if (!organizerWalletAddress) {
      setError("Wallet address not available.");
      setIsLoading(false);
      setEvents([]);
      return;
    }

    const fetchEvents = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `http://localhost:3001/api/events/by-organizer/${organizerWalletAddress}`,
        )
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }
        const data: IEventFromAPI[] = await response.json()
        setEvents(data)
      } catch (e: any) {
        console.error("Failed to fetch events:", e)
        setError(e.message || "Failed to fetch events. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [organizerWalletAddress, connected])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "ended":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      console.warn("Invalid date format:", dateString);
      return "Invalid Date";
    }
  }

  if (!connected && !isLoading) {
     return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg shadow-sm text-center">
        <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
        <strong className="font-bold">Wallet Not Connected:</strong>
        <span className="block sm:inline ml-1">Please connect your wallet to view your events.</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="ml-4 text-lg text-gray-700">Loading your events...</p>
      </div>
    )
  }

  if (error && connected) { // Only show general fetch error if wallet is connected
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm" role="alert">
        <div className="flex items-center">
          <AlertTriangle className="w-6 h-6 mr-3" />
          <div>
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Events</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your created events ({events.length})
          </p>
        </div>
        <a
          href="/new-event"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-center sm:text-left"
        >
          Create New Event
        </a>
      </div>

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

      {events.length === 0 && !isLoading && !error && connected && (
        <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
          <img src="/no-events.svg" alt="No events found" className="mx-auto h-32 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Events Yet</h3>
          <p className="text-gray-600">It looks like you haven't created any events.</p>
          <p className="text-gray-600">Click "Create New Event" to get started!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="relative h-40 sm:h-48">
              <img
                src={event.bannerImage || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`${getStatusColor(event.status)} text-xs font-medium px-2.5 py-1 rounded-full`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="p-4 sm:p-5 flex flex-col flex-grow">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 truncate" title={event.title}>{event.title}</h3>
              <div className="space-y-2 mb-4 text-xs sm:text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{formatDate(event.startDate)} at {event.startTime}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>
                    {event.totalTicketsSold} / {event.totalCapacity} tickets sold
                  </span>
                </div>
              </div>
              <div className="mt-auto flex flex-wrap justify-between items-center gap-2">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Revenue</p>
                  <p className="font-semibold text-gray-900">{event.totalRevenueSOL} SOL</p>
                </div>
                <button
                  onClick={() => onEventSelect(event._id)}
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