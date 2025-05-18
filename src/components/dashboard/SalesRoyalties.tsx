"use client"

import { useState } from "react"
import { Download, Calendar, ArrowUp, ArrowDown } from "lucide-react"

export default function SalesRoyalties() {
  const [timeRange, setTimeRange] = useState("30d")

  // Mock data for sales and royalties
  const salesData = {
    totalRevenue: "337.5 SOL",
    primarySales: "325 SOL",
    royalties: "12.5 SOL",
    transactions: 42,
    changePercent: 8.5,
    isPositive: true,
  }

  // Mock data for events revenue
  const eventsRevenue = [
    {
      event: "Solana Summer Hackathon",
      primarySales: "135 SOL",
      royalties: "4.5 SOL",
      totalRevenue: "139.5 SOL",
      transactions: 18,
    },
    {
      event: "NFT Gallery Opening",
      primarySales: "96 SOL",
      royalties: "3.2 SOL",
      totalRevenue: "99.2 SOL",
      transactions: 12,
    },
    {
      event: "Crypto Conference 2023",
      primarySales: "84 SOL",
      royalties: "4.8 SOL",
      totalRevenue: "88.8 SOL",
      transactions: 10,
    },
    {
      event: "DeFi Summit",
      primarySales: "10 SOL",
      royalties: "0 SOL",
      totalRevenue: "10 SOL",
      transactions: 2,
    },
  ]

  // Mock data for recent transactions
  const recentTransactions = [
    {
      id: "tx1",
      event: "Solana Summer Hackathon",
      type: "Primary Sale",
      amount: "1.5 SOL",
      wallet: "7xKX...9fGh",
      date: "Aug 10, 2023",
      status: "completed",
    },
    {
      id: "tx2",
      event: "NFT Gallery Opening",
      type: "Royalty",
      amount: "0.3 SOL",
      wallet: "3mNR...2qLp",
      date: "Aug 8, 2023",
      status: "completed",
    },
    {
      id: "tx3",
      event: "Crypto Conference 2023",
      type: "Primary Sale",
      amount: "0.75 SOL",
      wallet: "9pTZ...5vWs",
      date: "Aug 5, 2023",
      status: "completed",
    },
    {
      id: "tx4",
      event: "Solana Summer Hackathon",
      type: "Primary Sale",
      amount: "1.5 SOL",
      wallet: "2kJB...7rDx",
      date: "Aug 3, 2023",
      status: "completed",
    },
    {
      id: "tx5",
      event: "NFT Gallery Opening",
      type: "Royalty",
      amount: "0.15 SOL",
      wallet: "5fAH...1cNj",
      date: "Aug 1, 2023",
      status: "completed",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Sales & Royalties</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Track your revenue from primary sales and secondary market royalties
        </p>
      </div>

      {/* Time Range Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              timeRange === "7d" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Last 7 days
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              timeRange === "30d" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Last 30 days
          </button>
          <button
            onClick={() => setTimeRange("90d")}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              timeRange === "90d" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Last 90 days
          </button>
          <button
            onClick={() => setTimeRange("year")}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              timeRange === "year" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            This year
          </button>
          <button
            onClick={() => setTimeRange("all")}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              timeRange === "all" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All time
          </button>
          <button className="flex items-center ml-auto text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg text-sm font-medium">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            Custom Range
          </button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Total Revenue</h2>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{salesData.totalRevenue}</p>
          <div className={`mt-2 flex items-center text-sm ${salesData.isPositive ? "text-green-600" : "text-red-600"}`}>
            {salesData.isPositive ? (
              <ArrowUp className="w-4 h-4 mr-1 flex-shrink-0" />
            ) : (
              <ArrowDown className="w-4 h-4 mr-1 flex-shrink-0" />
            )}
            <span>{salesData.changePercent}% from previous period</span>
          </div>
          <div className="mt-4 flex flex-wrap justify-between text-xs sm:text-sm text-gray-600 gap-2">
            <span>Primary Sales: {salesData.primarySales}</span>
            <span>Royalties: {salesData.royalties}</span>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 md:col-span-2">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h2>
          <div className="bg-gray-100 rounded-lg h-40 sm:h-48 flex items-center justify-center">
            <p className="text-gray-500 text-sm sm:text-base">Revenue chart would appear here</p>
          </div>
        </div>
      </div>

      {/* Events Revenue */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Revenue by Event</h2>
          <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <Download className="w-4 h-4 mr-2 flex-shrink-0" />
            Export
          </button>
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
                    Event
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Primary Sales
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Royalties
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Revenue
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Transactions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {eventsRevenue.map((event, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.event}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{event.primarySales}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{event.royalties}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {event.totalRevenue}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{event.transactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle p-4 sm:p-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
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
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Wallet
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{tx.date}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{tx.event}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          tx.type === "Primary Sale" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.amount}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{tx.wallet}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  )
}
