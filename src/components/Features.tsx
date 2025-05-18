const Features = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        <div className="absolute bottom-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        <div className="absolute left-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent"></div>
        <div className="absolute right-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent"></div>

        {/* Decorative circles */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-bold mb-6">
            REVOLUTIONARY TECHNOLOGY
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
            Key Platform Features
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 relative overflow-hidden group">
            {/* Decorative background element */}
            <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-blue-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

            <div className="bg-blue-600 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6 relative">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <h3 className="text-2xl font-bold mb-4 text-center relative">Blockchain Security</h3>
            <p className="text-gray-600 text-center relative">
              Each ticket is a unique token on Solana blockchain, impossible to counterfeit or duplicate
            </p>

            <div className="mt-6 pt-6 border-t border-blue-100 relative">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Forgery Protection</span>
                <span className="text-blue-600 font-bold">100%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 relative overflow-hidden group">
            {/* Decorative background element */}
            <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-blue-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

            <div className="bg-blue-600 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6 relative">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22 12H18L15 21L9 3L6 12H2"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center relative">Secondary Market</h3>
            <p className="text-gray-600 text-center relative">
              Earn royalties from ticket resales automatically with smart contracts on the blockchain
            </p>

            <div className="mt-6 pt-6 border-t border-blue-100 relative">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Royalty Rate</span>
                <span className="text-blue-600 font-bold">Up to 10%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 relative overflow-hidden group">
            {/* Decorative background element */}
            <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-blue-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

            <div className="bg-blue-600 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6 relative">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 12L12 8L8 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M12 16V8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center relative">Mobile Validation</h3>
            <p className="text-gray-600 text-center relative">
              Quick entry via mobile app with Web3 login for seamless event access
            </p>

            <div className="mt-6 pt-6 border-t border-blue-100 relative">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Validation Time</span>
                <span className="text-blue-600 font-bold">&lt; 2 seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional feature highlight */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-10 flex flex-col justify-center">
              <div className="text-blue-200 font-bold mb-2">EXCLUSIVE FEATURE</div>
              <h3 className="text-3xl font-bold text-white mb-4">Digital Collectibles</h3>
              <p className="text-blue-100 mb-6">
                Event organizers can create exclusive digital collectibles for attendees as memorabilia or proof of
                attendance.
              </p>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Customizable NFT designs
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Automatic distribution to attendees
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Tradable on secondary markets
                </li>
              </ul>
            </div>
            <div className="bg-blue-800 p-10 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-500/30 rounded-full blur-xl"></div>
                <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 p-1 rounded-2xl">
                  <div className="bg-blue-800 rounded-xl p-6">
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="100" cy="100" r="80" fill="#1E40AF" />
                      <path
                        d="M100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20ZM100 160C66.8629 160 40 133.137 40 100C40 66.8629 66.8629 40 100 40C133.137 40 160 66.8629 160 100C160 133.137 133.137 160 100 160Z"
                        fill="#60A5FA"
                      />
                      <circle cx="100" cy="100" r="40" fill="#93C5FD" />
                      <path d="M120 80L80 120" stroke="white" strokeWidth="6" strokeLinecap="round" />
                      <path d="M80 80L120 120" stroke="white" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
