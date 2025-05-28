import React from "react"
import { X, Tag, Users, Wallet, SlidersHorizontal } from "lucide-react"

interface FilterPanelProps {
  categories: string[];
  issuers: string[];
  allUniqueTags: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  selectedIssuers: string[];
  toggleIssuer: (issuer: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPriceFromData: number;
  sortBy: string;
  setSortBy: (sort: string) => void;
  clearFilters: () => void;
  closePanel: () => void;
  hasActiveFilters: boolean;
}

export const FilterPanel = React.forwardRef<HTMLDivElement, FilterPanelProps>(
  (
    {
      categories,
      issuers,
      allUniqueTags,
      activeCategory,
      setActiveCategory,
      selectedIssuers,
      toggleIssuer,
      selectedTags,
      toggleTag,
      priceRange,
      setPriceRange,
      maxPriceFromData,
      sortBy,
      setSortBy,
      clearFilters,
      closePanel,
      hasActiveFilters,
    },
    ref
  ) => {
    return (
      <div className="bg-white border-b border-blue-100 shadow-md animate-fadeIn" ref={ref}>
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
                onClick={closePanel}
                className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-lg transition-all duration-300 hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-50">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                <Tag className="h-5 w-5 mr-2 text-blue-500" /> Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setActiveCategory("All")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeCategory === "All" ? "bg-blue-600 text-white shadow-md" : "bg-blue-50 text-gray-700 hover:bg-blue-100"}`}>
                  All
                </button>
                {categories.map((category) => (
                  <button key={category} onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeCategory === category ? "bg-blue-600 text-white shadow-md" : "bg-blue-50 text-gray-700 hover:bg-blue-100"}`}>
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-50">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                <Users className="h-5 w-5 mr-2 text-blue-500" /> Issuers
              </h3>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                {issuers.map((issuer) => (
                  <div key={issuer} className="flex items-center">
                    <input type="checkbox" id={`issuer-${issuer}`} checked={selectedIssuers.includes(issuer)} onChange={() => toggleIssuer(issuer)}
                      className="h-4 w-4 text-blue-600 rounded-sm border-gray-300 focus:ring-blue-500 focus:ring-offset-0"/>
                    <label htmlFor={`issuer-${issuer}`} className="ml-3 text-sm text-gray-700 font-medium cursor-pointer hover:text-blue-600 transition-colors duration-200">
                      {issuer.length > 12 ? `${issuer.substring(0, 6)}...${issuer.substring(issuer.length - 4)}` : issuer}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-50">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                <Tag className="h-5 w-5 mr-2 text-blue-500" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                {allUniqueTags.map((tag) => (
                  <button key={tag} onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${selectedTags.includes(tag) ? "bg-blue-600 text-white shadow-md" : "bg-blue-50 text-gray-700 hover:bg-blue-100"}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-50 space-y-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                  <Wallet className="h-5 w-5 mr-2 text-blue-500" /> Price Range (SOL)
                </h3>
                <div className="px-1">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span className="bg-blue-50 px-2 py-0.5 rounded-md text-blue-700">{priceRange[0].toFixed(1)} SOL</span>
                    <span className="bg-blue-50 px-2 py-0.5 rounded-md text-blue-700">{priceRange[1].toFixed(1)} SOL</span>
                  </div>
                  <input type="range" min="0" max={maxPriceFromData > 0 ? maxPriceFromData : 1} value={priceRange[0]} step="0.1"
                    onChange={(e) => {
                        const newMin = parseFloat(e.target.value);
                        setPriceRange([newMin, Math.max(newMin, priceRange[1])]);
                    }}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer mb-3 accent-blue-600" />
                  <input type="range" min="0" max={maxPriceFromData > 0 ? maxPriceFromData : 1} value={priceRange[1]} step="0.1"
                     onChange={(e) => {
                        const newMax = parseFloat(e.target.value);
                        setPriceRange([Math.min(priceRange[0], newMax), newMax]);
                    }}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                  <SlidersHorizontal className="h-5 w-5 mr-2 text-blue-500" /> Sort By
                </h3>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium bg-white">
                  <option value="date">Date (Soonest)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
FilterPanel.displayName = "FilterPanel";