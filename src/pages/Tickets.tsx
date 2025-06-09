// src/app/tickets/page.tsx (or your main Tickets component file)
import { useState, useEffect, useRef, useCallback } from "react" // Added useCallback
import {
  Search, ArrowRight, X,Ticket as TicketIconLucide, Loader2,Grid, List, ArrowUp,
} from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"

import Navbar from "../components/Navbar";
import { HeroSection } from "../components/ticketsPage/HeroSection";
import { FilterPanel } from "../components/ticketsPage/FilterPanel";
import { TicketCard } from "../components/ticketsPage/TicketCard";
import { TicketListItem } from "../components/ticketsPage/TicketListItem";
import { TicketTierModal } from "../components/ticketsPage/TicketTierModal";
import Footer from "../components/Footer";

export interface IEventAPITicketTier {
  _id?: any;
  name: string;
  priceSOL: number;
  supply?: number;
  ticketsSold?: number;
  description?: string;
}
export interface IEventFromAPI {
  _id: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  location: string;
  bannerImage?: string;
  category: string;
  organizerWalletAddress: string;
  totalTicketsSold: number;
  totalCapacity: number;
  ticketTiers: IEventAPITicketTier[];
  status?: string;
  description?: string;
}
export interface FrontendTicket {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  price: string;
  numericPrice: number;
  category: string;
  issuer: string;
  tags: string[];
  featured: boolean;
  attendees: number;
  remaining: number;
  verified: boolean;
  rating: number | null;
  reviews: number | null;
  trending: boolean;
  originalEvent: IEventFromAPI;
}

export type ActiveTabType = "all" | "trending" | "upcoming" | "featured";


const TicketsPage = () => {
  const [allFetchedTickets, setAllFetchedTickets] = useState<FrontendTicket[]>([])
  const [displayedTickets, setDisplayedTickets] = useState<FrontendTicket[]>([])

  const [fetchedCategories, setFetchedCategories] = useState<string[]>([])
  const [fetchedIssuers, setFetchedIssuers] = useState<string[]>([])
  const [fetchedAllUniqueTags, setFetchedAllUniqueTags] = useState<string[]>([])

  const [pageLoading, setPageLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [selectedIssuers, setSelectedIssuers] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50])
  const [maxPriceFromData, setMaxPriceFromData] = useState(50);
  const [sortBy, setSortBy] = useState("date")
  const [favorites, setFavorites] = useState<string[]>([])
  const [visibleCount, setVisibleCount] = useState(6)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [activeView, setActiveView] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState<ActiveTabType>("all")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [includeSoldOut, setIncludeSoldOut] = useState(false);


  const [isTierModalOpen, setIsTierModalOpen] = useState(false)
  const [selectedEventForModal, setSelectedEventForModal] = useState<FrontendTicket | null>(null)
  
  const { publicKey } = useWallet()
  const purchaserWalletAddress = publicKey ? publicKey.toBase58() : null

  const filterRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const fetchEvents = useCallback(async () => {
    setPageLoading(true);
    try {
      const response = await fetch("https://ticketsevent.onrender.com/api/events");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const eventsData: IEventFromAPI[] = await response.json();

      const transformedTickets: FrontendTicket[] = eventsData.map(event => {
        const firstTierPrice = event.ticketTiers?.[0]?.priceSOL;
        const displayPrice = typeof firstTierPrice === 'number' ? `${firstTierPrice.toFixed(1)} SOL` : "N/A";
        const numericPrice = typeof firstTierPrice === 'number' ? firstTierPrice : 0;
        
        const eventDate = new Date(event.startDate);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const isTrending = eventDate > thirtyDaysAgo && eventDate < thirtyDaysFromNow;

        return {
          id: event._id,
          title: event.title,
          date: event.startDate,
          location: event.location,
          image: event.bannerImage || "/placeholder.svg",
          price: displayPrice, numericPrice, category: event.category,
          issuer: event.organizerWalletAddress,
          tags: event.category ? [event.category] : [],
          featured: false,
          attendees: event.totalTicketsSold,
          remaining: event.totalCapacity - event.totalTicketsSold,
          verified: true,
          rating: null, reviews: null, trending: isTrending,
          originalEvent: event,
        };
      });
      setAllFetchedTickets(transformedTickets);

      const prices = transformedTickets.map(t => t.numericPrice).filter(p => typeof p === 'number');
      if (prices.length > 0) {
        const maxDataPrice = Math.ceil(Math.max(...prices, 5));
        setMaxPriceFromData(maxDataPrice);
        if (priceRange[1] === 50 && maxDataPrice > 50) {
             setPriceRange([0, maxDataPrice]);
        }
      } else {
        setMaxPriceFromData(50);
        setPriceRange([0, 50]);
      }

      setFetchedCategories(Array.from(new Set(transformedTickets.map(t => t.category).filter(Boolean))));
      setFetchedIssuers(Array.from(new Set(transformedTickets.map(t => t.issuer).filter(Boolean))));
      setFetchedAllUniqueTags(Array.from(new Set(transformedTickets.flatMap(t => t.tags).filter(Boolean))));
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setPageLoading(false);
    }
  }, [priceRange]); 

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSuccessfulPurchase = () => {
    fetchEvents();
    handleCloseTierModal();
  }

  useEffect(() => {
    let currentTickets = allFetchedTickets;
    if (!includeSoldOut) {
      currentTickets = currentTickets.filter(ticket => ticket.remaining > 0);
    }
    setDisplayedTickets(currentTickets);
  }, [allFetchedTickets, includeSoldOut]);


  const handleOpenTierModal = (ticket: FrontendTicket) => { setSelectedEventForModal(ticket); setIsTierModalOpen(true); }
  const handleCloseTierModal = () => {
    setTimeout(() => {
      setIsTierModalOpen(false);
      setSelectedEventForModal(null);
    }, 500);
  };

  const filteredTickets = displayedTickets.filter((ticket) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchLower) ||
      ticket.location.toLowerCase().includes(searchLower) ||
      ticket.issuer.toLowerCase().includes(searchLower) || 
      (ticket.originalEvent.description && ticket.originalEvent.description.toLowerCase().includes(searchLower));
    const matchesCategory = activeCategory === "All" || ticket.category === activeCategory;
    const matchesIssuer = selectedIssuers.length === 0 || selectedIssuers.includes(ticket.issuer);
    const matchesTags = selectedTags.length === 0 || ticket.tags.some((tag) => selectedTags.includes(tag));
    const matchesPrice = ticket.numericPrice >= priceRange[0] && ticket.numericPrice <= priceRange[1];
    const matchesVerified = verifiedOnly ? ticket.verified : true;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "trending" && ticket.trending) ||
      (activeTab === "upcoming" && new Date(ticket.originalEvent.startDate).getTime() > Date.now()) ||
      (activeTab === "featured" && ticket.featured);
    return matchesSearch && matchesCategory && matchesIssuer && matchesTags && matchesPrice && matchesVerified && matchesTab;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortBy === "price-low") return a.numericPrice - b.numericPrice;
    if (sortBy === "price-high") return b.numericPrice - a.numericPrice;
    if (sortBy === "date") return new Date(a.originalEvent.startDate).getTime() - new Date(b.originalEvent.startDate).getTime();
    if (sortBy === "popularity") return b.attendees - a.attendees;
    if (sortBy === "rating" && a.rating !== null && b.rating !== null) return b.rating - a.rating;
    return 0;
  });

  const visibleTickets = sortedTickets.slice(0, visibleCount);

  const toggleIssuer = (issuerToToggle: string) => setSelectedIssuers(prev => prev.includes(issuerToToggle) ? prev.filter(i => i !== issuerToToggle) : [...prev, issuerToToggle]);
  const toggleTag = (tagToToggle: string) => setSelectedTags(prev => prev.includes(tagToToggle) ? prev.filter(t => t !== tagToToggle) : [...prev, tagToToggle]);
  const toggleFavorite = (id: string) => setFavorites(prev => prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]);

  const clearFilters = () => {
    setActiveCategory("All"); setSelectedIssuers([]); setSelectedTags([]);
    setPriceRange([0, maxPriceFromData]); setSortBy("date");
    setVerifiedOnly(false); setActiveTab("all"); setSearchTerm("");
    setIncludeSoldOut(false);
  };
  
  const filterCount = selectedIssuers.length +
    selectedTags.length +
    (activeCategory !== "All" ? 1 : 0) +
    (sortBy !== "date" ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < maxPriceFromData ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (activeTab !== "all" ? 1 : 0) +
    (includeSoldOut ? 1 : 0);
  const loadMore = () => { setIsLoadingMore(true); setTimeout(() => { setVisibleCount(prev => Math.min(prev + 6, sortedTickets.length)); setIsLoadingMore(false); }, 800); };
  const scrollToTop = () => heroRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { const handleScroll = () => setShowScrollToTop(window.scrollY > 500); window.addEventListener("scroll", handleScroll); return () => window.removeEventListener("scroll", handleScroll); }, []);
  useEffect(() => { if (isFilterPanelOpen && filterRef.current) filterRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); }, [isFilterPanelOpen]);

  const formatDateForCardDisplay = (isoDateString?: string): string => {
    if (!isoDateString) return "Date TBD";
    try { return new Date(isoDateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return "Invalid Date"; }
  };

  if (pageLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="h-16 w-16 animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main>
        <HeroSection
          heroRef={heroRef} searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          isFilterOpen={isFilterPanelOpen} setIsFilterOpen={setIsFilterPanelOpen}
          activeTab={activeTab} setActiveTab={setActiveTab}
          verifiedOnly={verifiedOnly} setVerifiedOnly={setVerifiedOnly}
          filterCount={filterCount}
        />

        {isFilterPanelOpen && (
          <FilterPanel
            ref={filterRef} 
            categories={fetchedCategories}
            issuers={fetchedIssuers}
            allUniqueTags={fetchedAllUniqueTags}
            activeCategory={activeCategory} setActiveCategory={setActiveCategory}
            selectedIssuers={selectedIssuers} toggleIssuer={toggleIssuer}
            selectedTags={selectedTags} toggleTag={toggleTag}
            priceRange={priceRange} setPriceRange={setPriceRange} maxPriceFromData={maxPriceFromData}
            sortBy={sortBy} setSortBy={setSortBy}
            clearFilters={clearFilters}
            closePanel={() => setIsFilterPanelOpen(false)}
            hasActiveFilters={filterCount > 0}
          />
        )}

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                  <TicketIconLucide className="h-6 w-6 mr-2 text-blue-600" />
                  {sortedTickets.length} {sortedTickets.length === 1 ? "Event" : "Events"} Available
                </h2>
                <p className="text-gray-600 mt-1">Find your next unforgettable experience {includeSoldOut ? "(including sold out)" : ""}</p>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                 <button 
                    onClick={() => setIncludeSoldOut(prev => !prev)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${
                        includeSoldOut 
                        ? "bg-blue-100 text-blue-700 border-blue-300" 
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}`}
                >
                    {includeSoldOut ? "Hide Sold Out" : "Show Sold Out"}
                </button>
                {filterCount > 0 && (
                  <button onClick={clearFilters} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center bg-blue-50 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100">
                    <X className="h-4 w-4 mr-2" /> Clear Filters
                  </button>
                )}
                <div className="flex bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
                  <button onClick={() => setActiveView("grid")} className={`px-4 py-2 flex items-center ${activeView === "grid" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50"}`}><Grid className="h-4 w-4 mr-2" />Grid</button>
                  <button onClick={() => setActiveView("list")} className={`px-4 py-2 flex items-center ${activeView === "list" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50"}`}><List className="h-4 w-4 mr-2" />List</button>
                </div>
              </div>
            </div>

            {sortedTickets.length === 0 && !pageLoading ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-blue-50">
                <div className="bg-blue-100 p-4 rounded-lg inline-block mb-4"><Search className="h-8 w-8 text-blue-500" /></div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No events found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filters.</p>
                {filterCount > 0 && <button onClick={clearFilters} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Clear All Filters</button>}
              </div>
            ) : (
              <>
                {activeView === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {visibleTickets.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} isFavorite={favorites.includes(ticket.id)}
                        onToggleFavorite={toggleFavorite} onBuyTicketClick={handleOpenTierModal} formatDateForCard={formatDateForCardDisplay} />
                    ))}
                  </div>
                ) : ( 
                  <div className="space-y-6">
                    {visibleTickets.map((ticket) => (
                      <TicketListItem key={ticket.id} ticket={ticket} isFavorite={favorites.includes(ticket.id)}
                        onToggleFavorite={toggleFavorite} onBuyTicketClick={handleOpenTierModal} formatDateForCard={formatDateForCardDisplay}/>
                    ))}
                  </div>
                )}
                {visibleCount < sortedTickets.length && (
                  <div className="text-center mt-12">
                    <button onClick={loadMore} disabled={isLoadingMore} className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 font-medium text-lg inline-flex items-center shadow-sm hover:shadow-md">
                      {isLoadingMore ? (<><Loader2 className="animate-spin h-5 w-5 mr-2" />Loading...</>) : (<>Load More Events <ArrowRight className="ml-2 h-5 w-5" /></>)}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <TicketTierModal 
        isOpen={isTierModalOpen} 
        onClose={handleCloseTierModal} 
        event={selectedEventForModal} 
        purchaserWalletAddress={purchaserWalletAddress} 
        onSuccessfulPurchase={handleSuccessfulPurchase}
      />

      {showScrollToTop && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 z-[90] animate-fadeIn" aria-label="Scroll to top"> {/* Ensure modal z-index is higher */}
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      <Footer />
    </div>
  )
}

export default TicketsPage