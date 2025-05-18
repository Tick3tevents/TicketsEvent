import { ArrowRight } from "lucide-react"

const IssuerCTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-white opacity-5 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-white opacity-5 rounded-tr-full"></div>

        {/* Ticket patterns */}
        <svg width="100%" height="100%" className="absolute inset-0 opacity-10">
          <pattern id="ticket-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M10 0H30C35.5228 0 40 4.47715 40 10V30C40 35.5228 35.5228 40 30 40H10C4.47715 40 0 35.5228 0 30V10C0 4.47715 4.47715 0 10 0Z"
              stroke="white"
              strokeWidth="1"
              fill="none"
            />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#ticket-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-bold mb-6">
            FOR EVENT ORGANIZERS
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">Create NFT Tickets</h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Create, customize, and manage your event tickets as NFTs on Solana
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-3xl font-bold mb-2">Royalties</div>
              <p className="text-blue-100">Earn from secondary market sales automatically</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-3xl font-bold mb-2">Access Levels</div>
              <p className="text-blue-100">Create VIP, backstage, and general admission tiers</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-3xl font-bold mb-2">Analytics</div>
              <p className="text-blue-100">Track sales, attendance, and engagement metrics</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-3xl font-bold mb-2">Collectibles</div>
              <p className="text-blue-100">Add digital memorabilia for attendees</p>
            </div>
          </div>

          <button className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 font-medium text-lg shadow-lg shadow-blue-900/30 hover:shadow-xl hover:shadow-blue-900/40 transform hover:-translate-y-1 group">
            Start Issuing Tickets
            <ArrowRight className="inline-block ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Dashboard preview */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-t-2xl p-3 border border-white/10">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-b-2xl border-x border-b border-white/10 shadow-2xl">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-3 bg-white/10 rounded-xl p-4">
                <div className="text-blue-200 text-sm mb-3">Navigation</div>
                <div className="space-y-2">
                  <div className="bg-white/20 rounded-lg p-2 text-white">Dashboard</div>
                  <div className="p-2 text-blue-100">Events</div>
                  <div className="p-2 text-blue-100">Tickets</div>
                  <div className="p-2 text-blue-100">Analytics</div>
                  <div className="p-2 text-blue-100">Settings</div>
                </div>
              </div>
              <div className="col-span-9 space-y-6">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-blue-200 text-sm mb-3">Event Overview</div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-3xl font-bold">3</div>
                      <div className="text-blue-200 text-sm">Active Events</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-3xl font-bold">1,250</div>
                      <div className="text-blue-200 text-sm">Tickets Sold</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-3xl font-bold">5.2 SOL</div>
                      <div className="text-blue-200 text-sm">Revenue</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-blue-200 text-sm mb-3">Recent Activity</div>
                  <div className="space-y-2">
                    <div className="bg-white/10 rounded-lg p-2 flex justify-between items-center">
                      <span>Ticket #1234 sold</span>
                      <span className="text-blue-200 text-sm">2 min ago</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 flex justify-between items-center">
                      <span>Ticket #1233 resold</span>
                      <span className="text-blue-200 text-sm">15 min ago</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 flex justify-between items-center">
                      <span>New event created</span>
                      <span className="text-blue-200 text-sm">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
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
  )
}

export default IssuerCTA
