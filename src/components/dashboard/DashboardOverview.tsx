"use client"

import { ArrowUp, ArrowDown, AlertCircle } from "lucide-react"

export default function DashboardOverview() {
  // Mock data for dashboard metrics
  const metrics = [
    {
      title: "Tickets Sold",
      value: "1,234",
      change: "+12%",
      isPositive: true,
      icon: "🎫",
    },
    {
      title: "Total Revenue",
      value: "456 SOL",
      change: "+8.5%",
      isPositive: true,
      icon: "💸",
    },
    {
      title: "Royalties Earned",
      value: "32 SOL",
      change: "+5.2%",
      isPositive: true,
      icon: "💰",
    },
    {
      title: "Active Events",
      value: "8",
      change: "0%",
      isPositive: true,
      icon: "📍",
    },
  ]

  // Mock data for top performing events
  const topEvents = [
    {
      name: "Solana Summer Hackathon",
      ticketsSold: 450,
      totalCapacity: 500,
      revenue: "135 SOL",
      date: "Aug 15, 2023",
    },
    {
      name: "NFT Gallery Opening",
      ticketsSold: 320,
      totalCapacity: 350,
      revenue: "96 SOL",
      date: "Jul 28, 2023",
    },
    {
      name: "Crypto Conference 2023",
      ticketsSold: 280,
      totalCapacity: 400,
      revenue: "84 SOL",
      date: "Sep 5, 2023",
    },
  ]

  // Mock data for upcoming events
  const upcomingEvents = [
    {
      name: "DeFi Summit",
      date: "Oct 12, 2023",
      ticketsSold: 180,
      totalCapacity: 300,
      daysLeft: 14,
    },
    {
      name: "Web3 Gaming Expo",
      date: "Nov 5, 2023",
      ticketsSold: 120,
      totalCapacity: 250,
      daysLeft: 38,
    },
  ]

  // Mock data for issues/flags
  const issues = [
    {
      event: "Metaverse Workshop",
      issue: "Low ticket sales (15%)",
      severity: "high",
    },
    {
      event: "Blockchain Basics",
      issue: "Almost sold out (90%)",
      severity: "medium",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Welcome back! Here's what's happening with your events.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">{metric.title}</p>
                <p className="text-xl sm:text-2xl font-bold mt-1 text-gray-900">{metric.value}</p>
              </div>
              <div className="text-xl sm:text-2xl">{metric.icon}</div>
            </div>
            <div
              className={`mt-2 flex items-center text-xs sm:text-sm ${metric.isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {metric.isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              <span>{metric.change} from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Events */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">📊 Top Performing Events</h2>
          <div className="space-y-4">
            {topEvents.map((event, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <h3 className="font-medium text-gray-900">{event.name}</h3>
                  <span className="text-blue-600 font-medium">{event.revenue}</span>
                </div>
                <div className="flex flex-wrap justify-between items-center mt-2 text-xs sm:text-sm text-gray-600 gap-2">
                  <span>{event.date}</span>
                  <span>
                    {event.ticketsSold} / {event.totalCapacity} tickets sold
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(event.ticketsSold / event.totalCapacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">📍 Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <h3 className="font-medium text-gray-900">{event.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {event.daysLeft} days left
                  </span>
                </div>
                <div className="flex flex-wrap justify-between items-center mt-2 text-xs sm:text-sm text-gray-600 gap-2">
                  <span>{event.date}</span>
                  <span>
                    {event.ticketsSold} / {event.totalCapacity} tickets sold
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(event.ticketsSold / event.totalCapacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Issues/Flags */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">🛑 Issues Requiring Attention</h2>
        {issues.length > 0 ? (
          <div className="space-y-4">
            {issues.map((issue, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center p-4 rounded-lg bg-gray-50">
                <div
                  className={`p-2 rounded-full mb-2 sm:mb-0 sm:mr-4 self-start ${
                    issue.severity === "high"
                      ? "bg-red-100 text-red-600"
                      : issue.severity === "medium"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{issue.event}</h3>
                  <p className="text-gray-600 text-sm mt-1">{issue.issue}</p>
                </div>
                <button className="mt-3 sm:mt-0 sm:ml-auto bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  View
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No issues to report at this time.</p>
        )}
      </div>
    </div>
  )
}
