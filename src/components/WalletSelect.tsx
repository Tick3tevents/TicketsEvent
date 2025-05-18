"use client"

import { useState, useRef, useEffect } from "react"
import {
  Wallet,
  ChevronDown,
  X,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  LogOut,
  RefreshCw,
} from "lucide-react"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

// Define wallet types
type WalletName = "phantom" | "solflare" | "backpack" | "slope"

interface WalletInfo {
  id: WalletName
  name: string
  icon: JSX.Element
  adapter?: any
}

// Connection states
type ConnectionState = "disconnected" | "connecting" | "connected" | "error"

interface WalletSelectProps {
  className?: string
  onConnectionChange?: (connected: boolean) => void
}

export default function WalletSelect({ className = "", onConnectionChange }: WalletSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<WalletName | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected")
  const [balance, setBalance] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Wallet definitions
  const WALLETS: WalletInfo[] = [
    {
      id: "phantom",
      name: "Phantom",
      icon: (
        <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="128" height="128" rx="64" fill="#AB9FF2" />
          <path
            d="M110.584 64.9142H99.142C99.142 41.7651 80.173 23 56.7724 23C33.6612 23 14.8354 41.3057 14.4052 64.0583C13.9557 87.8216 33.1937 108 57.0272 108H60.8799C83.0375 108 110.584 91.7057 110.584 64.9142Z"
            fill="white"
          />
          <path
            d="M77.9129 64.9142H89.3548C89.3548 52.5966 79.2502 42.5714 66.8129 42.5714C54.5913 42.5714 44.6299 52.2765 44.2714 64.4155C43.8935 77.0353 53.7936 87.4286 66.4738 87.4286H68.3541C79.9409 87.4286 95.7999 79.3539 95.7999 64.9142H77.9129Z"
            fill="#AB9FF2"
          />
        </svg>
      ),
    },
    {
      id: "solflare",
      name: "Solflare",
      icon: (
        <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="128" height="128" rx="64" fill="#FC9022" />
          <path
            d="M108 40.5L84.5 31L66 56L90.5 64.5L108 40.5Z"
            fill="white"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M66 56L42.5 46.5L20 72L43.5 80.5L66 56Z"
            fill="white"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M90.5 64.5L66 56L43.5 80.5L67 89L90.5 64.5Z"
            fill="white"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M43.5 80.5L67 89L43.5 97.5L20 89L43.5 80.5Z"
            fill="white"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "backpack",
      name: "Backpack",
      icon: (
        <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="128" height="128" rx="64" fill="#121212" />
          <path
            d="M88 44H40C37.8 44 36 45.8 36 48V92C36 94.2 37.8 96 40 96H88C90.2 96 92 94.2 92 92V48C92 45.8 90.2 44 88 44Z"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M56 44V36C56 33.8 57.8 32 60 32H68C70.2 32 72 33.8 72 36V44"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M36 60H92" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "slope",
      name: "Slope",
      icon: (
        <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="128" height="128" rx="64" fill="#6E66FA" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M41.6 41.6H86.4V52.8639H52.8639V86.4H41.6V41.6ZM63.7361 63.7361H86.4V86.4H63.7361V63.7361Z"
            fill="white"
          />
        </svg>
      ),
    },
  ]

  // Check if wallet is available in window
  const isWalletAvailable = (walletName: WalletName): boolean => {
    if (typeof window === "undefined") return false

    switch (walletName) {
      case "phantom":
        return window.hasOwnProperty("solana") && (window as any).solana?.isPhantom
      case "solflare":
        return window.hasOwnProperty("solflare")
      case "backpack":
        return window.hasOwnProperty("backpack")
      case "slope":
        return window.hasOwnProperty("Slope")
      default:
        return false
    }
  }

  // Filter available wallets
  const availableWallets = WALLETS.filter((wallet) => isWalletAvailable(wallet.id))

  // Connect to wallet
  const connectWallet = async (walletId: WalletName) => {
    setSelectedWallet(walletId)
    setConnectionState("connecting")

    try {
      let provider

      switch (walletId) {
        case "phantom":
          provider = (window as any).solana
          break
        case "solflare":
          provider = (window as any).solflare
          break
        case "backpack":
          provider = (window as any).backpack
          break
        case "slope":
          const slope = new (window as any).Slope()
          provider = slope
          break
        default:
          throw new Error("Unsupported wallet")
      }

      if (!provider) {
        throw new Error("Wallet provider not found")
      }

      // Connect to wallet
      const resp = await provider.connect()
      const address = resp.publicKey.toString()

      setWalletAddress(address)
      setConnectionState("connected")

      if (onConnectionChange) {
        onConnectionChange(true)
      }

      // Get balance (simplified for demo)
      setBalance(Math.round(Math.random() * 1000) / 100)

      // Listen for account changes
      provider.on("accountChanged", (publicKey: any) => {
        if (publicKey) {
          setWalletAddress(publicKey.toString())
        } else {
          // Disconnected
          handleDisconnect()
        }
      })
    } catch (error) {
      console.error("Connection error:", error)
      setConnectionState("error")
      setErrorMessage("Failed to connect to wallet. Please try again.")
    }
  }

  const handleWalletSelect = (walletId: WalletName) => {
    // Check if wallet is installed
    if (!isWalletAvailable(walletId)) {
      // Redirect to wallet website
      const walletUrls: Record<WalletName, string> = {
        phantom: "https://phantom.app/",
        solflare: "https://solflare.com/",
        backpack: "https://www.backpack.app/",
        slope: "https://slope.finance/",
      }

      window.open(walletUrls[walletId], "_blank")
      return
    }

    connectWallet(walletId)
  }

  const handleDisconnect = () => {
    // Disconnect from wallet
    if (selectedWallet && (window as any)[selectedWallet]) {
      try {
        ;(window as any)[selectedWallet].disconnect()
      } catch (error) {
        console.error("Disconnect error:", error)
      }
    }

    setSelectedWallet(null)
    setWalletAddress(null)
    setBalance(null)
    setConnectionState("disconnected")

    if (onConnectionChange) {
      onConnectionChange(false)
    }
  }

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRefreshBalance = () => {
    // In a real app, you would fetch the actual balance here
    setBalance(Math.round(Math.random() * 1000) / 100)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Check for wallet on load
  useEffect(() => {
    // Auto-detect wallet
    if (typeof window !== "undefined") {
      let connected = false
      if ((window as any).solana?.isPhantom) {
        setSelectedWallet("phantom")
        if ((window as any).solana.isConnected) {
          setWalletAddress((window as any).solana.publicKey.toString())
          setConnectionState("connected")
          setBalance(Math.round(Math.random() * 1000) / 100) // Mock balance
          connected = true
        }
      } else if ((window as any).solflare?.isConnected) {
        setSelectedWallet("solflare")
        setWalletAddress((window as any).solflare.publicKey.toString())
        setConnectionState("connected")
        setBalance(Math.round(Math.random() * 1000) / 100) // Mock balance
        connected = true
      }

      if (onConnectionChange) {
        onConnectionChange(connected)
      }
    }
  }, [])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {connectionState === "connected" ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300"
        >
          {WALLETS.find((w) => w.id === selectedWallet)?.icon}
          <span className="ml-2 font-medium">
            {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Connected"}
          </span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </button>
      ) : connectionState === "connecting" ? (
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl opacity-80 cursor-not-allowed"
          disabled
        >
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          <span className="font-medium">Connecting...</span>
        </button>
      ) : connectionState === "error" ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-300"
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="font-medium">Connection Error</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300"
        >
          <Wallet className="h-4 w-4 mr-2" />
          <span className="font-medium">Connect</span>
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-blue-100 z-50 animate-fadeIn">
          <div className="p-4 border-b border-blue-100">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                {connectionState === "connected"
                  ? "Wallet Connected"
                  : connectionState === "error"
                    ? "Connection Error"
                    : "Connect Wallet"}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {connectionState === "connected" ? (
            <div className="p-4">
              <div className="flex items-center mb-4">
                {WALLETS.find((w) => w.id === selectedWallet)?.icon}
                <span className="ml-2 font-medium">{WALLETS.find((w) => w.id === selectedWallet)?.name}</span>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Wallet Address</span>
                  <button
                    onClick={handleCopyAddress}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Copy address"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <p className="text-sm text-gray-600 break-all font-mono">{walletAddress}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Balance</span>
                  <button
                    onClick={handleRefreshBalance}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Refresh balance"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-600 rounded-full w-4 h-4 mr-2 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{balance?.toFixed(2)} SOL</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleDisconnect}
                  className="flex-1 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-300 text-sm font-medium flex items-center justify-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </button>
                <a
                  href={`https://explorer.solana.com/address/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm font-medium flex items-center justify-center"
                >
                  View on Explorer
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          ) : connectionState === "error" ? (
            <div className="p-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">
                  {errorMessage || "Failed to connect to wallet. Please try again."}
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setConnectionState("disconnected")
                    setErrorMessage(null)
                  }}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedWallet) {
                      handleWalletSelect(selectedWallet)
                    } else {
                      setConnectionState("disconnected")
                    }
                  }}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Connect with one of our available wallet providers or create a new one.
              </p>
              <div className="space-y-2">
                {WALLETS.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletSelect(wallet.id)}
                    className="w-full flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                  >
                    <div className="mr-3">{wallet.icon}</div>
                    <span className="font-medium">{wallet.name}</span>
                    {!isWalletAvailable(wallet.id) && (
                      <span className="ml-auto text-xs text-blue-600 flex items-center">
                        Install <ExternalLink className="h-3 w-3 ml-1" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-blue-100">
                <a
                  href="https://docs.solana.com/wallet-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <span>New to Solana wallets?</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
