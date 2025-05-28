import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Wallet as WalletIconLucide,
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
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletReadyState,
  type WalletAdapter,
  type WalletName,
} from "@solana/wallet-adapter-base";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

type ConnectionDisplayState = "disconnected" | "connecting" | "connected" | "error";

interface WalletSelectProps {
  className?: string;
  onConnectionChange?: (connected: boolean, walletAddress: string | null) => void;
  rpcUrl?: string;
}

export default function WalletSelect({
  className = "",
  onConnectionChange,
  rpcUrl = "https://api.devnet.solana.com",
}: WalletSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [connectionDisplayState, setConnectionDisplayState] = useState<ConnectionDisplayState>("disconnected");
  const [balance, setBalance] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentError, setCurrentError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    wallets,
    select,
    publicKey,
    connected,
    connecting,
    disconnect,
    wallet: currentWallet,
    disconnecting,
    connect,
  } = useWallet();

  const walletAddress = publicKey?.toBase58() || null;
  const solConnection = useRef(new Connection(rpcUrl, "confirmed")).current;

  const fetchBalance = useCallback(async () => {
    if (publicKey && solConnection) {
      try {
        setCurrentError(null);
        const lamports = await solConnection.getBalance(publicKey);
        setBalance(lamports / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        setBalance(null);
        setCurrentError("Could not fetch balance.");
      }
    } else {
      setBalance(null);
    }
  }, [publicKey, solConnection]);

  const [prevConnected, setPrevConnected] = useState(connected);

  useEffect(() => {
    let newDisplayState: ConnectionDisplayState = "disconnected";

    if (connected && publicKey) {
      newDisplayState = "connected";
      fetchBalance();
      if (currentError && currentError.startsWith("Failed to connect")) {
        setCurrentError(null);
      }
    } else if (connecting || disconnecting) {
      newDisplayState = "connecting";
    } else if (currentError) {
      newDisplayState = "error";
    } else {
      newDisplayState = "disconnected";
    }
    setConnectionDisplayState(newDisplayState);

    if (onConnectionChange) {
      onConnectionChange(newDisplayState === "connected", publicKey?.toBase58() || null);
    }
  }, [
    connected,
    connecting,
    disconnecting,
    publicKey,
    fetchBalance,
    onConnectionChange,
    currentError
  ]);

  useEffect(() => {
    if (connected && !prevConnected && isOpen) {
      setIsOpen(false);
    }
    setPrevConnected(connected);
  }, [connected, prevConnected, isOpen]);


  const handleWalletAction = async (adapter: WalletAdapter) => {
    if (adapter.readyState === WalletReadyState.NotDetected) {
      if (adapter.url) {
        window.open(adapter.url, "_blank", "noopener noreferrer");
      } else {
        setCurrentError(`${adapter.name} is not installed.`);
      }
      return;
    }

    setCurrentError(null);
    select(adapter.name as WalletName);

    try {
      setConnectionDisplayState("connecting");
      await connect();
    } catch (error: any) {
      console.error(`Connection error with ${adapter.name}:`, error);
      let message = error.message || `Failed to connect to ${adapter.name}. Please try again.`;
      if (error.name === 'WalletConnectError' && error.message.includes('User rejected the request')) {
        message = 'Connection request rejected by user.';
      }
      setCurrentError(message);
    }
  };

  const handleDisconnect = async () => {
    setCurrentError(null);
    setIsOpen(false); // Close dropdown before attempting disconnect
    try {
      await disconnect();
    } catch (error: any) {
      console.error("Disconnect error:", error);
      setCurrentError(error.message || "Failed to disconnect.");
    }
  };

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefreshBalance = () => {
    if (connected && publicKey) {
      fetchBalance();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sortedWallets = useMemo(() => {
    return [...wallets].sort((a, b) => {
      const order = {
        [WalletReadyState.Installed]: 1,
        [WalletReadyState.Loadable]: 2,
        [WalletReadyState.NotDetected]: 3,
        [WalletReadyState.Unsupported]: 4,
      };
      const orderA = order[a.readyState] ?? 5;
      const orderB = order[b.readyState] ?? 5;
      if (orderA !== orderB) return orderA - orderB;
      return a.adapter.name.localeCompare(b.adapter.name);
    });
  }, [wallets]);

  const renderButtonContent = () => {
    switch (connectionDisplayState) {
      case "connected":
        return (
          <>
            {currentWallet && (
              <img
                src={currentWallet.adapter.icon}
                alt={`${currentWallet.adapter.name} icon`}
                className="w-6 h-6 rounded-full"
              />
            )}
            <span className="ml-2 font-medium">
              {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Connected"}
            </span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </>
        );
      case "connecting":
        return (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            <span className="font-medium">{connecting ? "Connecting..." : disconnecting ? "Disconnecting..." : "Processing..."}</span>
          </>
        );
      case "error":
        return (
          <>
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="font-medium">Error</span>
          </>
        );
      case "disconnected":
      default:
        return (
          <>
            <WalletIconLucide className="h-4 w-4 mr-2" />
            <span className="font-medium">Connect Wallet</span>
          </>
        );
    }
  };

  const getButtonClass = () => {
    switch (connectionDisplayState) {
      case "connected": return "bg-blue-600 text-white hover:bg-blue-700";
      case "connecting": return "bg-blue-600 text-white opacity-80 cursor-not-allowed";
      case "error": return "bg-red-600 text-white hover:bg-red-700";
      case "disconnected":
      default: return "bg-blue-600 text-white hover:bg-blue-700";
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => {
            setIsOpen(!isOpen);
        }}
        disabled={connectionDisplayState === "connecting"}
        className={`flex items-center px-4 py-2 rounded-xl transition-colors duration-300 ${getButtonClass()}`}
      >
        {renderButtonContent()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-blue-100 z-50 animate-fadeIn">
          <div className="p-4 border-b border-blue-100">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                {connectionDisplayState === "connected"
                  ? "Wallet Connected"
                  : connectionDisplayState === "error"
                  ? "Connection Error"
                  : "Select Wallet"}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {connectionDisplayState === "connected" && currentWallet ? (
            <div className="p-4">
              <div className="flex items-center mb-4">
                <img
                  src={currentWallet.adapter.icon}
                  alt={currentWallet.adapter.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="ml-2 font-medium">{currentWallet.adapter.name}</span>
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

              {balance !== null && (
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
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-4 h-4 mr-2 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">S</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">{balance.toFixed(4)} SOL</p>
                  </div>
                </div>
              )}
              {currentError && balance === null && connectionDisplayState === "connected" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-xs text-red-600">
                  {currentError}
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={handleDisconnect}
                  className="flex-1 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-300 text-sm font-medium flex items-center justify-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </button>
              </div>
            </div>
          ) : connectionDisplayState === "error" ? (
            <div className="p-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">
                  {currentError || "An unknown error occurred."}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setCurrentError(null);
                    setConnectionDisplayState("disconnected");
                    // setIsOpen(true); // Optionally keep open to re-select
                  }}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm font-medium"
                >
                  Choose Wallet
                </button>
                {currentWallet && currentWallet.adapter.readyState !== WalletReadyState.NotDetected && (
                  <button
                    onClick={() => handleWalletAction(currentWallet.adapter)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm font-medium"
                  >
                    Try Again with {currentWallet.adapter.name}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4">
              {sortedWallets.length > 0 ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect with one of our available wallet providers.
                  </p>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {sortedWallets.map((walletAdapterMeta) => (
                      <button
                        key={walletAdapterMeta.adapter.name}
                        onClick={() => handleWalletAction(walletAdapterMeta.adapter)}
                        disabled={walletAdapterMeta.adapter.readyState === WalletReadyState.Unsupported}
                        className="w-full flex items-center p-3 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                      >
                        <img
                          src={walletAdapterMeta.adapter.icon}
                          alt={walletAdapterMeta.adapter.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="ml-3 font-medium text-gray-800">{walletAdapterMeta.adapter.name}</span>
                        {walletAdapterMeta.readyState === WalletReadyState.NotDetected && (
                          <span className="ml-auto text-xs text-blue-600 flex items-center">
                            Install <ExternalLink className="h-3 w-3 ml-1" />
                          </span>
                        )}
                        {walletAdapterMeta.readyState === WalletReadyState.Installed && (
                          <span className="ml-auto text-xs text-green-500 bg-green-100 px-2 py-0.5 rounded-full">Detected</span>
                        )}
                        {walletAdapterMeta.readyState === WalletReadyState.Loadable && (
                          <span className="ml-auto text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">Loadable</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <WalletIconLucide className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">No Wallet Adapters Found</p>
                  <p className="text-xs text-gray-500">
                    Ensure `WalletProvider` is configured correctly with wallet adapters.
                  </p>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-blue-100">
                <a
                  href="https://solana.com/ecosystem/explore?categories=wallet"
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
  );
}