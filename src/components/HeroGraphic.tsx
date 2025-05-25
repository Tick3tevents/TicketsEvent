const HeroGraphic = () => {
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-2xl mx-auto"
    >
      {/* Background circles */}
      <circle cx="400" cy="300" r="250" fill="url(#blue-gradient)" fillOpacity="0.1" />
      <circle cx="400" cy="300" r="200" fill="url(#blue-gradient)" fillOpacity="0.15" />
      <circle cx="400" cy="300" r="150" fill="url(#blue-gradient)" fillOpacity="0.2" />

      {/* Ticket outline */}
      <path
        d="M500 180H300C288.954 180 280 188.954 280 200V400C280 411.046 288.954 420 300 420H500C511.046 420 520 411.046 520 400V200C520 188.954 511.046 180 500 180Z"
        stroke="url(#blue-gradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="8 8"
      />

      {/* Ticket inner details */}
      <rect x="300" y="220" width="200" height="2" rx="1" fill="#3B82F6" fillOpacity="0.6" />
      <rect x="300" y="260" width="200" height="2" rx="1" fill="#3B82F6" fillOpacity="0.6" />
      <rect x="300" y="300" width="200" height="2" rx="1" fill="#3B82F6" fillOpacity="0.6" />
      <rect x="300" y="340" width="200" height="2" rx="1" fill="#3B82F6" fillOpacity="0.6" />
      <rect x="300" y="380" width="200" height="2" rx="1" fill="#3B82F6" fillOpacity="0.6" />

      {/* QR code representation */}
      <rect x="440" y="300" width="60" height="60" rx="4" fill="#3B82F6" fillOpacity="0.8" />
      <rect x="450" y="310" width="40" height="40" rx="2" fill="white" />
      <rect x="455" y="315" width="10" height="10" rx="1" fill="#3B82F6" />
      <rect x="475" y="315" width="10" height="10" rx="1" fill="#3B82F6" />
      <rect x="455" y="335" width="10" height="10" rx="1" fill="#3B82F6" />
      <rect x="475" y="335" width="10" height="10" rx="1" fill="#3B82F6" />

      {/* Blockchain nodes */}
      <circle cx="250" cy="150" r="8" fill="#3B82F6" />
      <circle cx="550" cy="150" r="8" fill="#3B82F6" />
      <circle cx="250" cy="450" r="8" fill="#3B82F6" />
      <circle cx="550" cy="450" r="8" fill="#3B82F6" />

      <line x1="250" y1="150" x2="550" y2="150" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 6" />
      <line x1="550" y1="150" x2="550" y2="450" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 6" />
      <line x1="550" y1="450" x2="250" y2="450" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 6" />
      <line x1="250" y1="450" x2="250" y2="150" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 6" />

      {/* Solana logo representation */}
      <path d="M380 120L420 120L400 100L380 120Z" fill="#3B82F6" />
      <path d="M380 480L420 480L400 500L380 480Z" fill="#3B82F6" />

      {/* Defs for gradients */}
      <defs>
        <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default HeroGraphic
