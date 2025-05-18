"use client"

import { Home, Ticket, PlusCircle, Users, DollarSign, LogOut } from "lucide-react"

interface DashboardSidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isMobile: boolean
}

export default function DashboardSidebar({
  activeView,
  setActiveView,
  isOpen,
  setIsOpen,
  isMobile,
}: DashboardSidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { id: "myEvents", label: "My Events", icon: <Ticket className="w-5 h-5" /> },
    { id: "createEvent", label: "Create Event", icon: <PlusCircle className="w-5 h-5" />, href: "/new-event" },
    { id: "attendees", label: "Attendees", icon: <Users className="w-5 h-5" /> },
    { id: "salesRoyalties", label: "Sales & Royalties", icon: <DollarSign className="w-5 h-5" /> },
  ]

  // Handle navigation item click
  const handleNavClick = (id: string) => {
    setActiveView(id)
    if (isMobile) {
      setIsOpen(false) // Close sidebar on mobile when clicking a nav item
    }
  }

  return (
    <aside
      className={`fixed left-0 top-0 pt-20 h-full bg-white shadow-md transition-all duration-300 z-40 
        ${isOpen ? "w-64 translate-x-0" : isMobile ? "w-64 -translate-x-full" : "w-20 translate-x-0"}`}
    >
      <div className="flex flex-col h-full">
        <div className="px-4 py-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 rounded-full p-2 mr-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M2 9H22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 20V9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2
              className={`text-xl font-bold text-gray-800 transition-opacity duration-200 
                ${isOpen || isMobile ? "opacity-100" : "opacity-0"}`}
            >
              Organizer
            </h2>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <div key={item.id}>
                {item.href ? (
                  <a
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors
                      ${activeView === item.id ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span
                      className={`transition-opacity duration-200 
                        ${isOpen || isMobile ? "opacity-100" : "opacity-0"}`}
                    >
                      {item.label}
                    </span>
                  </a>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors
                      ${activeView === item.id ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span
                      className={`transition-opacity duration-200 
                        ${isOpen || isMobile ? "opacity-100" : "opacity-0"}`}
                    >
                      {item.label}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-auto px-4 py-6 border-t border-gray-200">
          <button
            className="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => console.log("Logout")}
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className={`transition-opacity duration-200 ${isOpen || isMobile ? "opacity-100" : "opacity-0"}`}>
              Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}
