"use client"
import { Filter, Flame, Calendar, Star, BadgeCheck } from "lucide-react"

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (verified: boolean) => void;
  filterCount: number;
}

export const HeroSection = ({
  heroRef, searchTerm, setSearchTerm, isFilterOpen, setIsFilterOpen,
  activeTab, setActiveTab, verifiedOnly, setVerifiedOnly, filterCount
}: HeroSectionProps) => {
  return (
    <section
      ref={heroRef}
      className="pt-24 pb-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,#3b82f6,#1e3a8a)]"></div>
        <svg width="100%" height="100%" className="absolute inset-0 opacity-5">
          <pattern id="tickets-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M15 0H45C52.5228 0 60 7.47715 60 15V45C60 52.5228 52.5228 60 45 60H15C7.47715 60 0 52.5228 0 45V15C0 7.47715 7.47715 0 15 0Z" stroke="white" strokeWidth="1" fill="none"/>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#tickets-pattern)" />
        </svg>
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-300 rounded-full opacity-10 blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm text-white px-4 py-1 rounded-lg mb-6 animate-fadeIn">DISCOVER & COLLECT</div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fadeIn leading-tight">Explore <span className="text-blue-200">NFT Tickets</span> for Unforgettable Events</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 animate-fadeIn">Secure your spot at exclusive events with blockchain-powered tickets on Solana</p>
          <div className="relative max-w-2xl mx-auto animate-fadeIn">
            <div className="flex bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
              <input type="text" placeholder="Search events, locations, or issuers..." className="w-full px-5 py-4 bg-transparent text-white placeholder-blue-200 focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`px-5 flex items-center ${isFilterOpen ? "text-blue-200" : "text-white"} transition-colors duration-300`}>
                <Filter className="h-5 w-5" />
                {filterCount > 0 && (<span className="ml-2 bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{filterCount}</span>)}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap justify-center mt-8 gap-3 animate-fadeIn">
            {['all', 'trending', 'upcoming', 'featured'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${activeTab === tab ? "bg-white text-blue-600 shadow-lg" : "bg-white/10 text-white hover:bg-white/20"}`}>
                {tab === 'trending' && <Flame className="h-4 w-4 mr-1" />}
                {tab === 'upcoming' && <Calendar className="h-4 w-4 mr-1" />}
                {tab === 'featured' && <Star className="h-4 w-4 mr-1" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'all' ? 'Events' : ''}
              </button>
            ))}
            <button onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${verifiedOnly ? "bg-white text-blue-600 shadow-lg" : "bg-white/10 text-white hover:bg-white/20"}`}>
              <BadgeCheck className="h-4 w-4 mr-1" /> Verified Only
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-16 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-current"></path>
        </svg>
      </div>
    </section>
  )
}