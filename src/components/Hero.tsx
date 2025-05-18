import { ArrowRight } from "lucide-react"

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white overflow-hidden flex items-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Ticket patterns */}
        <svg width="100%" height="100%" className="absolute inset-0 opacity-10">
          <pattern id="hero-ticket-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M15 0H45C52.5228 0 60 7.47715 60 15V45C60 52.5228 52.5228 60 45 60H15C7.47715 60 0 52.5228 0 45V15C0 7.47715 7.47715 0 15 0Z"
              stroke="white"
              strokeWidth="1"
              fill="none"
            />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#hero-ticket-pattern)" />
        </svg>

        {/* Decorative circles */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>

        {/* Decorative lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-bold mb-6">
              REVOLUTIONARY NFT TICKETING
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
              The Future of <span className="text-blue-200">Event Ticketing</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-lg">
              Secure, blockchain-powered tickets on Solana that revolutionize event access
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <a
                href="/tickets"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-medium flex items-center justify-center text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Browse Tickets
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-medium text-lg hover:bg-white/10 transition-colors duration-300">
                Issue Tickets
              </button>
            </div>
          </div>

          <div className="relative">
            {/* 3D Ticket Mockup */}
            <div className="relative">
              {/* Main ticket */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-6 relative z-20">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-blue-600 font-bold text-xl">SOLANA SUMMIT</div>
                    <div className="text-gray-600">JULY 15-17, 2023</div>
                  </div>
                  <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">2.5 SOL</div>
                </div>

                <div className="border-t border-dashed border-gray-300 my-4 relative">
                  <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full"></div>
                  <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full"></div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-sm">TICKET HOLDER</div>
                    <div className="font-bold">Alex Johnson</div>
                  </div>
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="60" height="60" rx="4" fill="#E5E7EB" />
                      <rect x="10" y="10" width="10" height="10" rx="2" fill="#3B82F6" />
                      <rect x="25" y="10" width="10" height="10" rx="2" fill="#3B82F6" />
                      <rect x="40" y="10" width="10" height="10" rx="2" fill="#3B82F6" />
                      <rect x="10" y="25" width="10" height="10" rx="2" fill="#3B82F6" />
                      <rect x="25" y="25" width="10" height="10" rx="2" fill="#3B82F6" />
                      <rect x="40" y="25" width="10" height="10" rx="2" fill="#3B82F6" />
                      <rect x="10" y="40" width="10" height="10" rx="2" fill="#3B82F6" />
                      <rect x="25" y="40" width="10" height="10" rx="2" fill="#3B82F6" />
                      <rect x="40" y="40" width="10" height="10" rx="2" fill="#3B82F6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Background tickets for 3D effect */}
              <div className="absolute top-6 -left-4 right-4 bottom-0 bg-white/30 backdrop-blur-sm rounded-2xl transform rotate-3 z-10"></div>
              <div className="absolute top-12 -left-8 right-8 bottom-0 bg-white/20 backdrop-blur-sm rounded-2xl transform rotate-0 z-0"></div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-10 -right-10 bg-blue-500/30 backdrop-blur-sm p-4 rounded-xl">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M12 16V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="absolute -bottom-5 -left-5 bg-blue-500/30 backdrop-blur-sm p-4 rounded-xl">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22 12H18L15 21L9 3L6 12H2"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
            <div className="text-4xl font-bold mb-2">10,000+</div>
            <p className="text-blue-100">Tickets issued on Solana</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
            <div className="text-4xl font-bold mb-2">500+</div>
            <p className="text-blue-100">Events powered by Ticket3</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
            <div className="text-4xl font-bold mb-2">100%</div>
            <p className="text-blue-100">Secure and verifiable</p>
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

export default Hero
