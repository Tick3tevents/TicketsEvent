"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import WalletSelect from "./WalletSelect"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  // Function to be passed to WalletSelect to update connection status
  const handleWalletConnection = (connected: boolean) => {
    setIsWalletConnected(connected)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-3 text-gray-900" : "bg-transparent py-6 text-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`${scrolled ? "bg-blue-600" : "bg-white/20 backdrop-blur-sm"} rounded-full p-2`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <span className={`ml-2 text-2xl font-bold tracking-wider ${scrolled ? "text-blue-600" : "text-white"}`}>
              Ticket3
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <a
              href="#"
              className={`${
                scrolled ? "text-gray-700 hover:text-blue-600" : "text-white/80 hover:text-white"
              } transition-colors font-medium`}
            >
              Events
            </a>
            <a
              href="/tickets"
              className={`${
                scrolled ? "text-gray-700 hover:text-blue-600" : "text-white/80 hover:text-white"
              } transition-colors font-medium`}
            >
              Tickets
            </a>
            <a
              href="#"
              className={`${
                scrolled ? "text-gray-700 hover:text-blue-600" : "text-white/80 hover:text-white"
              } transition-colors font-medium`}
            >
              Create
            </a>
            {isWalletConnected && (
              <a
                href="/dashboard"
                className={`${
                  scrolled ? "text-gray-700 hover:text-blue-600" : "text-white/80 hover:text-white"
                } transition-colors font-medium`}
              >
                Dashboard
              </a>
            )}
            <a
              href="#"
              className={`${
                scrolled ? "text-gray-700 hover:text-blue-600" : "text-white/80 hover:text-white"
              } transition-colors font-medium`}
            >
              About
            </a>
            <WalletSelect onConnectionChange={handleWalletConnection} />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${scrolled ? "text-gray-700" : "text-white"} focus:outline-none`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            className={`md:hidden pt-4 pb-3 mt-4 ${scrolled ? "border-t border-blue-100" : "border-t border-white/20"}`}
          >
            <div className="flex flex-col space-y-3">
              <a
                href="#"
                className={`${
                  scrolled ? "text-gray-700 hover:text-blue-600" : "text-white/80 hover:text-white"
                } transition-colors font-medium py-2`}
              >
                Events
              </a>
              <a
                href="/tickets"
                className={`${
                  scrolled ? "text-gray-700 hover:text-blue-600" : "text-white/80 hover:text-white"
                } transition-colors font-medium py-2`}
              >
                Tickets
              </a>
              <a
                href="#"
                className={`${
                  scrolled ? "text-gray-700 hover:text-blue-600" : "text-white/80 hover:text-white"
                } transition-colors font-medium py-2`}
              >
                Create
              </a>
              {isWalletConnected && (
                <a
                  href="/dashboard"
                  className={`${
                    scrolled ? "text-gray-700 hover:text-blue-600" : "text-white/80 hover:text-white"
                  } transition-colors font-medium py-2`}
                >
                  Dashboard
                </a>
              )}
              <a
                href="#"
                className={`${
                  scrolled ? "text-gray-700 hover:text-blue-600" : "text-white/80 hover:text-white"
                } transition-colors font-medium py-2`}
              >
                About
              </a>
              <WalletSelect className="self-start" onConnectionChange={handleWalletConnection} />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
