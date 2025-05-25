import { Twitter, Github, DiscIcon as Discord } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-white relative overflow-hidden">
      <div className="bg-blue-50 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 rounded-full p-2">
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
                <span className="ml-2 text-3xl font-bold tracking-wider text-blue-600">Tick3t</span>
              </div>
              <p className="text-gray-600 mb-6">
                The future of event ticketing on Solana blockchain. Secure, transparent, and unforgeable.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-white p-2 rounded-full text-blue-500 hover:text-white hover:bg-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-white p-2 rounded-full text-blue-500 hover:text-white hover:bg-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-white p-2 rounded-full text-blue-500 hover:text-white hover:bg-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Discord className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-800">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Browse Events
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    For Organizers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-800">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-800">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-blue-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Ticket3. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
