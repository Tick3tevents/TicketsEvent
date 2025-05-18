"use client"

import { useState, useEffect } from "react"
import DashboardSidebar from "../components/dashboard/DashboardSidebar"
import DashboardOverview from "../components/dashboard/DashboardOverview"
import MyEvents from "../components/dashboard/MyEvents"
import EventDetail from "../components/dashboard/EventDetail"
import Attendees from "../components/dashboard/Attendees"
import SalesRoyalties from "../components/dashboard/SalesRoyalties"

export default function Dashboard() {
  const [activeView, setActiveView] = useState("dashboard")
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setSidebarOpen(!mobile) // Close sidebar by default on mobile
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Handle event selection for event detail view
  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId)
    setActiveView("eventDetail")
    if (isMobile) {
      setSidebarOpen(false) // Close sidebar when selecting an event on mobile
    }
  }

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Render the appropriate view based on activeView state
  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardOverview />
      case "myEvents":
        return <MyEvents onEventSelect={handleEventSelect} />
      case "eventDetail":
        return selectedEventId ? (
          <EventDetail eventId={selectedEventId} />
        ) : (
          <MyEvents onEventSelect={handleEventSelect} />
        )
      case "attendees":
        return <Attendees />
      case "salesRoyalties":
        return <SalesRoyalties />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar
          activeView={activeView}
          setActiveView={setActiveView}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          isMobile={isMobile}
        />

        <main
          className={`flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300 pt-20
          ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}
        >
          {/* Mobile menu toggle button */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg"
            >
              {sidebarOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}

          {renderView()}
        </main>
      </div>
    </div>
  )
}
