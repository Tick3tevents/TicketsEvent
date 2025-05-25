"use client"

import { useState } from "react"
import { Search, Download, Filter } from "lucide-react"

export default function Attendees() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEvent, setSelectedEvent] = useState("all")
  const [selectedTicketType, setSelectedTicketType] = useState("all")

  // Mock data for attendees
  const attendees = [
    {
      id: "1",
      wallet: "7xKX...9fGh",
      event: "Solana Summer Hackathon",
      ticketType: "VIP Access",
      checkedIn: true,
      resold: false,
      purchaseDate: "Jul 15, 2023",
    },
    {
      id: "2",
      wallet: "3mNR...2qLp",
      event: "Solana Summer Hackathon",
      ticketType: "General Admission",
      checkedIn: false,
      resold: false,
      purchaseDate: "Jul 18, 2023",
    },
    {
      id: "3",
      wallet: "9pTZ...5vWs",
      event: "NFT Gallery Opening",
      ticketType: "Workshop Pass",
      checkedIn: true,
      resold: false,
      purchaseDate: "Jul 10, 2023",
    },
    {
      id: "4",
      wallet: "2kJB...7rDx",
      event: "Crypto Conference 2023",
      ticketType: "General Admission",
      checkedIn: false,
      resold: true,
      purchaseDate: "Aug 5, 2023",
    },
    {
      id: "5",
      wallet: "5fAH...1cNj",
      event: "NFT Gallery Opening",
      ticketType: "VIP Access",
      checkedIn: false,
      resold: false,
      purchaseDate: "Jul 12, 2023",
    },
    {
      id: "6",
      wallet: "8rPQ...3mVx",
      event: "Crypto Conference 2023",
      ticketType: "VIP Access",
      checkedIn: true,
      resold: false,
      purchaseDate: "Aug 2, 2023",
    },
    {
      id: "7",
      wallet: "4jLM...6tHs",
      event: "Solana Summer Hackathon",
      ticketType: "Workshop Pass",
      checkedIn: false,
      resold: false,
      purchaseDate: "Jul 20, 2023",
    },
  ]

  // Filter attendees based on search query and filters
  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.wallet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.event.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEvent = selectedEvent === "all" || attendee.event === selectedEvent
    const matchesTicketType = selectedTicketType === "all" || attendee.ticketType === selectedTicketType

    return matchesSearch && matchesEvent && matchesTicketType
  })

  // Get unique events for filter dropdown
  const events = [...new Set(attendees.map((a) => a.event))]

  // Get unique ticket types for filter dropdown
  const ticketTypes = [...new Set(attendees.map((a) => a.ticketType))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Attendees</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage all attendees across your events</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by wallet or event"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
            >
              <option value="all">All Events</option>
              {events.map((event, index) => (
                <option key={index} value={event}>
                  {event}
                </option>
              ))}
            </select>

            <select
              value={selectedTicketType}
              onChange={(e) => setSelectedTicketType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
            >
              <option value="all">All Ticket Types</option>
              {ticketTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <div className="flex gap-2 sm:ml-auto">
              <button className="flex items-center bg-white border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex-1 sm:flex-none justify-center sm:justify-start">
                <Filter className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="text-sm">Filters</span>
              </button>

              <button className="flex items-center bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-1 sm:flex-none justify-center sm:justify-start">
                <Download className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="text-sm">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Attendees Table */}
        <div className="mt-6 overflow-x-auto -mx-4 sm:mx-0">
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
                    Event
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
                    Purchase Date
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
                {filteredAttendees.map((attendee) => (
                  <tr key={attendee.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{attendee.wallet}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{attendee.event}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{attendee.ticketType}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{attendee.purchaseDate}</td>
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            Showing {filteredAttendees.length} of {attendees.length} attendees
          </p>
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
}
