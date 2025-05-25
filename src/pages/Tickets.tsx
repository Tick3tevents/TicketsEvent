"use client"

import { useState, useEffect, useRef } from "react"
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  ArrowRight,
  X,
  Tag,
  Wallet,
  Ticket,
  Users,
  Heart,
  Sparkles,
  SlidersHorizontal,
  Loader2,
  Star,
  ChevronRight,
  Grid,
  List,
  Flame,
  BadgeCheck,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import WalletSelect from "../components/WalletSelect"

// Mock data for tickets with more variety
const MOCK_TICKETS = [
  {
    id: 1,
    title: "Solana Summer Hackathon",
    date: "June 15-17, 2023",
    location: "San Francisco, CA",
    image: "/tech-conference.png",
    price: "0.5 SOL",
    category: "Tech",
    issuer: "Solana Foundation",
    tags: ["Hackathon", "Developers", "Web3"],
    featured: true,
    attendees: 1200,
    remaining: 50,
    verified: true,
    rating: 4.9,
    reviews: 128,
    trending: true,
  },
  {
    id: 2,
    title: "Web3 Music Festival",
    date: "July 22-24, 2023",
    location: "Miami, FL",
    image: "/vibrant-music-festival.png",
    price: "1.2 SOL",
    category: "Music",
    issuer: "SoundDAO",
    tags: ["Festival", "Live Music", "NFT"],
    featured: false,
    attendees: 5000,
    remaining: 250,
    verified: true,
    rating: 4.7,
    reviews: 342,
    trending: true,
  },
  {
    id: 3,
    title: "NFT Art Exhibition",
    date: "August 5-7, 2023",
    location: "New York, NY",
    image: "/art-exhibition.png",
    price: "0.8 SOL",
    category: "Art",
    issuer: "Digital Gallery DAO",
    tags: ["Exhibition", "Digital Art", "Creators"],
    featured: false,
    attendees: 800,
    remaining: 120,
    verified: true,
    rating: 4.8,
    reviews: 95,
    trending: false,
  },
  {
    id: 4,
    title: "DeFi Conference 2023",
    date: "September 10-12, 2023",
    location: "London, UK",
    image: "/finance-conference.png",
    price: "1.5 SOL",
    category: "Finance",
    issuer: "DeFi Alliance",
    tags: ["Conference", "Finance", "Blockchain"],
    featured: false,
    attendees: 1500,
    remaining: 200,
    verified: true,
    rating: 4.6,
    reviews: 187,
    trending: false,
  },
  {
    id: 5,
    title: "Metaverse Gaming Expo",
    date: "October 3-5, 2023",
    location: "Tokyo, Japan",
    image: "/gaming-expo.png",
    price: "0.7 SOL",
    category: "Gaming",
    issuer: "GameFi Collective",
    tags: ["Gaming", "Metaverse", "Play-to-Earn"],
    featured: false,
    attendees: 2200,
    remaining: 180,
    verified: false,
    rating: 4.5,
    reviews: 210,
    trending: true,
  },
  {
    id: 6,
    title: "Blockchain Summit Asia",
    date: "November 18-20, 2023",
    location: "Singapore",
    image: "/blockchain-summit.png",
    price: "2.0 SOL",
    category: "Tech",
    issuer: "Asia Blockchain Association",
    tags: ["Summit", "Blockchain", "Enterprise"],
    featured: false,
    attendees: 3000,
    remaining: 500,
    verified: true,
    rating: 4.9,
    reviews: 312,
    trending: false,
  },
  {
    id: 7,
    title: "Crypto Art Festival",
    date: "December 8-10, 2023",
    location: "Berlin, Germany",
    image: "/crypto-art.png",
    price: "0.6 SOL",
    category: "Art",
    issuer: "CryptoCreatives",
    tags: ["Festival", "Digital Art", "NFT"],
    featured: false,
    attendees: 1800,
    remaining: 300,
    verified: false,
    rating: 4.4,
    reviews: 156,
    trending: false,
  },
  {
    id: 8,
    title: "Web3 Developer Conference",
    date: "January 15-17, 2024",
    location: "Austin, TX",
    image: "/developer-conference.png",
    price: "1.0 SOL",
    category: "Tech",
    issuer: "Web3 Foundation",
    tags: ["Conference", "Developers", "Web3"],
    featured: false,
    attendees: 2500,
    remaining: 400,
    verified: true,
    rating: 4.7,
    reviews: 230,
    trending: true,
  },
  {
    id: 9,
    title: "Solana Ecosystem Summit",
    date: "February 22-24, 2024",
    location: "Dubai, UAE",
    image: "/blockchain-summit.png",
    price: "1.8 SOL",
    category: "Tech",
    issuer: "Solana Foundation",
    tags: ["Summit", "Ecosystem", "Blockchain"],
    featured: true,
    attendees: 4000,
    remaining: 600,
    verified: true,
    rating: 4.9,
    reviews: 420,
    trending: true,
  },
]

// List of all unique issuers from the tickets
const ISSUERS = Array.from(new Set(MOCK_TICKETS.map((ticket) => ticket.issuer)))

// List of all unique categories from the tickets
const CATEGORIES = Array.from(new Set(MOCK_TICKETS.map((ticket) => ticket.category)))

// List of all unique tags from the tickets
const ALL_TAGS = Array.from(new Set(MOCK_TICKETS.flatMap((ticket) => ticket.tags)))

const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedIssuers, setSelectedIssuers] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2])
  const [sortBy, setSortBy] = useState("date")
  const [favorites, setFavorites] = useState<number[]>([])
  const [savedEvents, setSavedEvents] = useState<number[]>([])
  const [visibleCount, setVisibleCount] = useState(6)
  const [isLoading, setIsLoading] = useState(false)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [activeView, setActiveView] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState<"all" | "trending" | "upcoming" | "featured">("all")
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const filterRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  // Filter tickets based on search, category, issuers, tags, and price range
  const filteredTickets = MOCK_TICKETS.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.issuer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = activeCategory === "All" || ticket.category === activeCategory

    const matchesIssuer = selectedIssuers.length === 0 || selectedIssuers.includes(ticket.issuer)

    const matchesTags = selectedTags.length === 0 || ticket.tags.some((tag) => selectedTags.includes(tag))

    const ticketPrice = Number.parseFloat(ticket.price.split(" ")[0])
    const matchesPrice = ticketPrice >= priceRange[0] && ticketPrice <= priceRange[1]

    const matchesVerified = verifiedOnly ? ticket.verified : true

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "trending" && ticket.trending) ||
      (activeTab === "upcoming" && new Date(ticket.date.split("-")[0]).getTime() > Date.now()) ||
      (activeTab === "featured" && ticket.featured)

    return (
      matchesSearch && matchesCategory && matchesIssuer && matchesTags && matchesPrice && matchesVerified && matchesTab
    )
  })

  // Sort tickets based on the selected sort option
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortBy === "price-low") {
      return Number.parseFloat(a.price.split(" ")[0]) - Number.parseFloat(b.price.split(" ")[0])
    } else if (sortBy === "price-high") {
      return Number.parseFloat(b.price.split(" ")[0]) - Number.parseFloat(a.price.split(" ")[0])
    } else if (sortBy === "date") {
      return new Date(a.date.split("-")[0]).getTime() - new Date(b.date.split("-")[0]).getTime()
    } else if (sortBy === "popularity") {
      return b.attendees - a.attendees
    } else if (sortBy === "rating") {
      return b.rating - a.rating
    }
    return 0
  })

  // Get visible tickets based on the current count
  const visibleTickets = sortedTickets.slice(0, visibleCount)

  // Toggle issuer selection
  const toggleIssuer = (issuer: string) => {
    if (selectedIssuers.includes(issuer)) {
      setSelectedIssuers(selectedIssuers.filter((i) => i !== issuer))
    } else {
      setSelectedIssuers([...selectedIssuers, issuer])
    }
  }

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  // Toggle favorite
  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  // Toggle saved event
  const toggleSavedEvent = (id: number) => {
    if (savedEvents.includes(id)) {
      setSavedEvents(savedEvents.filter((savedId) => savedId !== id))
    } else {
      setSavedEvents([...savedEvents, id])
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setActiveCategory("All")
    setSelectedIssuers([])
    setSelectedTags([])
    setPriceRange([0, 2])
    setSortBy("date")
    setVerifiedOnly(false)
    setActiveTab("all")
  }

  // Load more tickets
  const loadMore = () => {
    setIsLoading(true)
    // Simulate loading delay
    setTimeout(() => {
      setVisibleCount(Math.min(visibleCount + 3, sortedTickets.length))
      setIsLoading(false)
    }, 800)
  }

  // Scroll to top
  const scrollToTop = () => {
    heroRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Check if any filters are applied
  const hasActiveFilters =
    activeCategory !== "All" ||
    selectedIssuers.length > 0 ||
    selectedTags.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 2 ||
    sortBy !== "date" ||
    verifiedOnly ||
    activeTab !== "all"

  // Handle scroll event to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Scroll to filter section when it opens
  useEffect(() => {
    if (isFilterOpen && filterRef.current) {
      filterRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [isFilterOpen])

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const [month, days, year] = dateString.split(/[-,]/)
    return `${month} ${days.trim()}, ${year.trim()}`
  }

  // Get remaining days until event
  const getRemainingDays = (dateString: string) => {
    const eventDate = new Date(dateString.split("-")[0])
    const today = new Date()
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="pt-24 pb-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden"
        >
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Animated gradient background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,#3b82f6,#1e3a8a)]"></div>

            {/* Ticket patterns */}
            <svg width="100%" height="100%" className="absolute inset-0 opacity-5">
              <pattern id="tickets-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path
                  d="M15 0H45C52.5228 0 60 7.47715 60 15V45C60 52.5228 52.5228 60 45 60H15C7.47715 60 0 52.5228 0 45V15C0 7.47715 7.47715 0 15 0Z"
                  stroke="white"
                  strokeWidth="1"
                  fill="none"
                />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#tickets-pattern)" />
            </svg>

            {/* Decorative circles */}
            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-300 rounded-full opacity-10 blur-3xl"></div>

            {/* Floating tickets */}
            <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-500 rounded-lg opacity-10 animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-400 rounded-lg opacity-10 animate-float-slow"></div>
            <div className="absolute top-3/4 left-1/3 w-12 h-12 bg-blue-300 rounded-lg opacity-10 animate-float-fast"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block bg-white/10 backdrop-blur-sm text-white px-4 py-1 rounded-lg mb-6 animate-fadeIn">
                DISCOVER & COLLECT
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fadeIn leading-tight">
                Explore <span className="text-blue-200">NFT Tickets</span> for Unforgettable Events
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 animate-fadeIn">
                Secure your spot at exclusive events with blockchain-powered tickets on Solana
              </p>

              {/* Simplified Search Bar */}
              <div className="relative max-w-2xl mx-auto animate-fadeIn">
                <div className="flex bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
                  <input
                    type="text"
                    placeholder="Search events, locations, or issuers..."
                    className="w-full px-5 py-4 bg-transparent text-white placeholder-blue-200 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`px-5 flex items-center ${
                      isFilterOpen ? "text-blue-200" : "text-white"
                    } transition-colors duration-300`}
                  >
                    <Filter className="h-5 w-5" />
                    {hasActiveFilters && (
                      <span className="ml-2 bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {selectedIssuers.length +
                          selectedTags.length +
                          (activeCategory !== "All" ? 1 : 0) +
                          (sortBy !== "date" ? 1 : 0) +
                          (priceRange[0] > 0 || priceRange[1] < 2 ? 1 : 0) +
                          (verifiedOnly ? 1 : 0) +
                          (activeTab !== "all" ? 1 : 0)}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick filter tabs */}
              <div className="flex flex-wrap justify-center mt-8 gap-3 animate-fadeIn">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === "all"
                      ? "bg-white text-blue-600 shadow-lg"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  All Events
                </button>
                <button
                  onClick={() => setActiveTab("trending")}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${
                    activeTab === "trending"
                      ? "bg-white text-blue-600 shadow-lg"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <Flame className="h-4 w-4 mr-1" />
                  Trending
                </button>
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${
                    activeTab === "upcoming"
                      ? "bg-white text-blue-600 shadow-lg"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab("featured")}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${
                    activeTab === "featured"
                      ? "bg-white text-blue-600 shadow-lg"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <Star className="h-4 w-4 mr-1" />
                  Featured
                </button>
                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${
                    verifiedOnly ? "bg-white text-blue-600 shadow-lg" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <BadgeCheck className="h-4 w-4 mr-1" />
                  Verified Only
                </button>
              </div>
            </div>
          </div>

          {/* Wave decoration */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg
              className="relative block w-full h-16 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className="fill-current"
              ></path>
            </svg>
          </div>
        </section>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="bg-white border-b border-blue-100 shadow-md animate-fadeIn" ref={filterRef}>
            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <SlidersHorizontal className="h-5 w-5 mr-2 text-blue-600" />
                  Advanced Filters
                </h2>
                <div className="flex items-center space-x-4">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center bg-blue-50 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </button>
                  )}
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-lg transition-all duration-300 hover:bg-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Categories */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-50">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                    <Tag className="h-5 w-5 mr-2 text-blue-500" />
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveCategory("All")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        activeCategory === "All"
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-blue-50 text-gray-700 hover:bg-blue-100"
                      }`}
                    >
                      All
                    </button>
                    {CATEGORIES.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          activeCategory === category
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-blue-50 text-gray-700 hover:bg-blue-100"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Issuers */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-50">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                    <Users className="h-5 w-5 mr-2 text-blue-500" />
                    Issuers
                  </h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                    {ISSUERS.map((issuer) => (
                      <div key={issuer} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`issuer-${issuer}`}
                          checked={selectedIssuers.includes(issuer)}
                          onChange={() => toggleIssuer(issuer)}
                          className="h-4 w-4 text-blue-600 rounded-lg border-gray-300 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`issuer-${issuer}`}
                          className="ml-3 text-sm text-gray-700 font-medium cursor-pointer hover:text-blue-600 transition-colors duration-200"
                        >
                          {issuer}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-50">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                    <Tag className="h-5 w-5 mr-2 text-blue-500" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ALL_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                          selectedTags.includes(tag)
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-blue-50 text-gray-700 hover:bg-blue-100"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range and Sort */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-50 space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                      <Wallet className="h-5 w-5 mr-2 text-blue-500" />
                      Price Range (SOL)
                    </h3>
                    <div className="px-2">
                      <div className="flex items-center justify-between mb-4">
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number.parseFloat(e.target.value), priceRange[1]])}
                          className="w-[45%] h-2 bg-blue-200 appearance-none cursor-pointer"
                        />
                        <span className="mx-2 text-gray-500">to</span>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number.parseFloat(e.target.value)])}
                          className="w-[45%] h-2 bg-blue-200 appearance-none cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-sm font-medium">
                        <span className="bg-blue-50 px-3 py-1 rounded-lg text-blue-600">
                          {priceRange[0].toFixed(1)} SOL
                        </span>
                        <span className="bg-blue-50 px-3 py-1 rounded-lg text-blue-600">
                          {priceRange[1].toFixed(1)} SOL
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                      <SlidersHorizontal className="h-5 w-5 mr-2 text-blue-500" />
                      Sort By
                    </h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
                    >
                      <option value="date">Date (Soonest)</option>
                      <option value="price-low">Price (Low to High)</option>
                      <option value="price-high">Price (High to Low)</option>
                      <option value="popularity">Popularity</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tickets Grid */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                  <Ticket className="h-6 w-6 mr-2 text-blue-600" />
                  {sortedTickets.length} {sortedTickets.length === 1 ? "Event" : "Events"} Available
                </h2>
                <p className="text-gray-600 mt-1">Find your next unforgettable experience</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center bg-blue-50 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </button>
                )}

                <div className="flex bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
                  <button
                    onClick={() => setActiveView("grid")}
                    className={`px-4 py-2 flex items-center ${
                      activeView === "grid"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-blue-50 transition-colors duration-300"
                    }`}
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    Grid
                  </button>
                  <button
                    onClick={() => setActiveView("list")}
                    className={`px-4 py-2 flex items-center ${
                      activeView === "list"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-blue-50 transition-colors duration-300"
                    }`}
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </button>
                </div>

                <WalletSelect />
              </div>
            </div>

            {sortedTickets.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-blue-50">
                <div className="bg-blue-100 p-4 rounded-lg inline-block mb-4">
                  <Search className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No events found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {activeView === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {visibleTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="bg-white overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-blue-50 group ticket-card relative"
                      >
                        <div className="relative h-48">
                          <img
                            src={ticket.image || "/placeholder.svg"}
                            alt={ticket.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute top-3 right-3 bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-lg">
                            {ticket.price}
                          </div>

                          {/* Simplified category badge */}
                          <div className="absolute bottom-3 left-3">
                            <div className="bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold px-3 py-1 rounded-lg">
                              {ticket.category}
                            </div>
                          </div>

                          {/* Favorite button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              toggleFavorite(ticket.id)
                            }}
                            className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg text-gray-600 hover:text-red-500 transition-colors"
                            aria-label={favorites.includes(ticket.id) ? "Remove from favorites" : "Add to favorites"}
                          >
                            {favorites.includes(ticket.id) ? (
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

                          {/* Simplified event details */}
                          <div className="flex items-center text-gray-600 mb-1">
                            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm">{formatDate(ticket.date)}</span>
                          </div>
                          <div className="flex items-center text-gray-600 mb-4">
                            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm">{ticket.location}</span>
                          </div>

                          {/* Buy button */}
                          <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium flex items-center justify-center">
                            Buy Ticket
                            <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // List view remains the same but we'll simplify it too
                  <div className="space-y-6">
                    {visibleTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="bg-white overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-blue-50 group ticket-card"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="relative md:w-1/3 h-60 md:h-auto">
                            <img
                              src={ticket.image || "/placeholder.svg"}
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

                            {/* Favorite button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                toggleFavorite(ticket.id)
                              }}
                              className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg text-gray-600 hover:text-red-500 transition-colors"
                              aria-label={favorites.includes(ticket.id) ? "Remove from favorites" : "Add to favorites"}
                            >
                              {favorites.includes(ticket.id) ? (
                                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                              ) : (
                                <Heart className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          <div className="p-6 md:w-2/3 flex flex-col relative">
                            <h3 className="text-2xl font-bold group-hover:text-blue-600 transition-colors duration-300 mb-3">
                              {ticket.title}
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="text-sm">{formatDate(ticket.date)}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="text-sm">{ticket.location}</span>
                              </div>
                            </div>

                            <div className="mt-auto">
                              <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium flex items-center justify-center">
                                Buy Ticket
                                <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {visibleCount < sortedTickets.length && (
                  <div className="text-center mt-12">
                    <button
                      onClick={loadMore}
                      className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 font-medium text-lg inline-flex items-center shadow-sm hover:shadow-md"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Load More Events
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Featured Events Section */}
        <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Animated gradient background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,#3b82f6,#1e3a8a)]"></div>

            {/* Ticket patterns */}
            <svg width="100%" height="100%" className="absolute inset-0 opacity-5">
              <pattern id="featured-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path
                  d="M15 0H45C52.5228 0 60 7.47715 60 15V45C60 52.5228 52.5228 60 45 60H15C7.47715 60 0 52.5228 0 45V15C0 7.47715 7.47715 0 15 0Z"
                  stroke="white"
                  strokeWidth="1"
                  fill="none"
                />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#featured-pattern)" />
            </svg>

            {/* Decorative circles */}
            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-300 rounded-full opacity-10 blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block bg-white/10 backdrop-blur-sm text-white px-4 py-1 rounded-lg mb-4">
                PREMIUM EXPERIENCES
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Featured Events</h2>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Discover our handpicked selection of premium events with exclusive perks and benefits
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {MOCK_TICKETS.filter((ticket) => ticket.featured).map((ticket) => (
                <div
                  key={ticket.id}
                  className="glass-card-dark rounded-xl overflow-hidden shadow-xl group relative transform transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                  <img
                    src={ticket.image || "/placeholder.svg"}
                    alt={ticket.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  />

                  <div className="relative z-20 p-8 text-white h-full flex flex-col justify-end">
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-bold flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-300" />
                      FEATURED
                    </div>

                    <div className="mb-2 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-yellow-300" />
                      <span className="text-sm text-blue-100">{ticket.issuer}</span>
                    </div>

                    <h3 className="text-3xl font-bold mb-3 group-hover:text-blue-200 transition-colors duration-300">
                      {ticket.title}
                    </h3>

                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-blue-300" />
                      <span className="text-blue-100">{formatDate(ticket.date)}</span>
                    </div>

                    <div className="flex items-center mb-4">
                      <MapPin className="h-4 w-4 mr-2 text-blue-300" />
                      <span className="text-blue-100">{ticket.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {ticket.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-white/10 backdrop-blur-sm text-blue-100 px-3 py-1 rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{ticket.price}</div>
                      <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium flex items-center hover:bg-blue-50 transition-colors duration-300 group-hover:shadow-lg">
                        View Details
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Event Categories Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-lg mb-4">BROWSE BY CATEGORY</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Event Categories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore events by category to find exactly what you're looking for
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {CATEGORIES.map((category) => {
                const categoryCount = MOCK_TICKETS.filter((ticket) => ticket.category === category).length
                let bgImage = "/placeholder.svg"

                // Assign images based on category
                if (category === "Tech") bgImage = "/tech-conference.png"
                if (category === "Music") bgImage = "/vibrant-music-festival.png"
                if (category === "Art") bgImage = "/art-exhibition.png"
                if (category === "Finance") bgImage = "/finance-conference.png"
                if (category === "Gaming") bgImage = "/gaming-expo.png"

                return (
                  <div
                    key={category}
                    className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
                    <img
                      src={bgImage || "/placeholder.svg"}
                      alt={category}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-4">
                      <h3 className="text-xl font-bold mb-1">{category}</h3>
                      <p className="text-sm text-blue-100">{categoryCount} events</p>
                      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="px-3 py-1 bg-white text-blue-600 rounded-lg text-xs font-medium flex items-center">
                          Explore
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Scroll to top button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 z-50 animate-fadeIn"
          aria-label="Scroll to top"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M5 12L12 5L19 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <Footer />
    </div>
  )
}

export default Tickets
