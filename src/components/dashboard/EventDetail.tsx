"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Ticket,
  Gift,
  Edit,
  ExternalLink,
  X,
  Download,
  Search,
} from "lucide-react"

interface EventDetailProps {
  eventId: string
}

export default function EventDetail({ eventId }: EventDetailProps) {
  const [activeTab, setActiveTab] = useState("summary")

  // Mock event data based on eventId
  // In a real app, you would fetch this data from an API
  const event = {
    id: eventId,
    name: "Solana Summer Hackathon",
    image: "/tech-conference.png",
    date: "Aug 15, 2023",
    time: "9:00 AM - 6:00 PM",
    location: "San Francisco, CA",
    description: "Join the biggest Solana hackathon of the summer. Build, learn, and connect with the community.",
    status: "published",
    ticketsSold: 450,
    totalCapacity: 500,
    revenue: "135 SOL",
    tiers: [
      {
        name: "General Admission",
        price: "0.5 SOL",
        sold: 300,
        total: 350,
        revenue: "150 SOL",
      },
      {
        name: "VIP Access",
        price: "1.5 SOL",
        sold: 100,
        total: 100,
        revenue: "150 SOL",
      },
      {
        name: "Workshop Pass",
        price: "0.75 SOL",
        sold: 50,
        total: 50,
        revenue: "37.5 SOL",
      },
    ],
    attendees: [
      { wallet: "7xKX...9fGh", ticketType: "VIP Access", checkedIn: true, resold: false },
      { wallet: "3mNR...2qLp", ticketType: "General Admission", checkedIn: false, resold: false },
      { wallet: "9pTZ...5vWs", ticketType: "Workshop Pass", checkedIn: true, resold: false },
      { wallet: "2kJB...7rDx", ticketType: "General Admission", checkedIn: false, resold: true },
      { wallet: "5fAH...1cNj", ticketType: "VIP Access", checkedIn: false, resold: false },
    ],
  }

  // Function to render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return (
          <div className="space-y-6">
            {/* Event Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-48 sm:h-64">
                <img src={event.image || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">
                  <h1 className="text-xl sm:text-3xl font-bold">{event.name}</h1>
                  <div className="flex flex-wrap gap-3 sm:gap-4 mt-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-sm sm:text-base text-gray-700">{event.description}</p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center text-blue-600 mb-2">
                      <Ticket className="w-5 h-5 mr-2 flex-shrink-0" />
                      <h3 className="font-semibold">Tickets Sold</h3>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {event.ticketsSold} / {event.totalCapacity}
                    </p>
                    <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(event.ticketsSold / event.totalCapacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center text-green-600 mb-2">
                      <DollarSign className="w-5 h-5 mr-2 flex-shrink-0" />
                      <h3 className="font-semibold">Total Revenue</h3>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{event.revenue}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">Primary sales</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center text-purple-600 mb-2">
                      <Users className="w-5 h-5 mr-2 flex-shrink-0" />
                      <h3 className="font-semibold">Check-in Rate</h3>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {Math.round((event.attendees.filter((a) => a.checkedIn).length / event.attendees.length) * 100)}%
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      {event.attendees.filter((a) => a.checkedIn).length} of {event.attendees.length} attendees
                    </p>
                  </div>
                </div>

                {/* QR Code for check-in */}
                <div className="mt-6 flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 rounded-lg gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Event Check-in QR Code</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Use this QR code at the event entrance to verify tickets
                    </p>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">QR Code</span>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto">
                    Download
                  </button>
                </div>
              </div>
            </div>

            {/* Ticket Tiers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Ticket Tiers</h2>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle p-4 sm:p-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Tier Name
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Sold
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {event.tiers.map((tier, index) => (
                        <tr key={index}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tier.name}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{tier.price}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {tier.sold} / {tier.total}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{tier.revenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button className="flex items-center bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <Gift className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                Airdrop NFTs
              </button>
              <button className="flex items-center bg-white border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Edit className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                Edit Event
              </button>
              <button className="flex items-center bg-white border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <ExternalLink className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                View on Explorer
              </button>
              <button className="flex items-center bg-red-50 text-red-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm">
                <X className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                End Ticket Sales
              </button>
            </div>
          </div>
        )
      case "stats":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Sales Statistics</h2>

              {/* Time Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium">24h</button>
                <button className="text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                  7d
                </button>
                <button className="text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                  30d
                </button>
                <button className="text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                  All time
                </button>
              </div>

              {/* Sales Chart Placeholder */}
              <div className="bg-gray-100 rounded-lg h-48 sm:h-64 flex items-center justify-center mb-6">
                <p className="text-gray-500 text-sm sm:text-base">Sales chart would appear here</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {event.tiers.map((tier, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                    <div className="mt-2 flex justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Sold</p>
                        <p className="font-bold text-gray-900">
                          {tier.sold} / {tier.total}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Revenue</p>
                        <p className="font-bold text-gray-900">{tier.revenue}</p>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(tier.sold / tier.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Market Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Secondary Market Activity</h2>

              {/* Resale Chart Placeholder */}
              <div className="bg-gray-100 rounded-lg h-40 sm:h-48 flex items-center justify-center mb-6">
                <p className="text-gray-500 text-sm sm:text-base">Resale activity chart would appear here</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Resale Volume</h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">12.5 SOL</p>
                  <p className="text-xs sm:text-sm text-gray-600">From 8 transactions</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Avg. Resale Price</h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">1.56 SOL</p>
                  <p className="text-xs sm:text-sm text-green-600">+24% above primary</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Royalties Earned</h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">1.25 SOL</p>
                  <p className="text-xs sm:text-sm text-gray-600">10% royalty rate</p>
                </div>
              </div>
            </div>
          </div>
        )
      case "attendees":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Attendees</h2>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search by wallet"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>

                  <select className="border border-gray-300 rounded-lg px-3 py-2 bg-white">
                    <option>All Ticket Types</option>
                    <option>General Admission</option>
                    <option>VIP Access</option>
                    <option>Workshop Pass</option>
                  </select>

                  <button className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4 mr-2 flex-shrink-0" />
                    Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle p-4 sm:p-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Wallet Address
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Ticket Type
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Checked In
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Resold
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {event.attendees.map((attendee, index) => (
                        <tr key={index}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {attendee.wallet}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{attendee.ticketType}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {attendee.checkedIn ? (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                ✓ Yes
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                No
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {attendee.resold ? (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                Yes
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                No
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                            <button>View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-600">Showing 5 of {event.attendees.length} attendees</p>
                <div className="flex space-x-2">
                  <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors">
                    Previous
                  </button>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return <div>Tab content not found</div>
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
        Back to My Events
      </button>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === "summary"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Event Summary
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === "stats" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sales & Stats
            </button>
            <button
              onClick={() => setActiveTab("attendees")}
              className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === "attendees"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Attendees
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">{renderTabContent()}</div>
      </div>
    </div>
  )
}
