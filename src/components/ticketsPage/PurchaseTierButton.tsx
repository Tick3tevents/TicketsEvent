import { useState } from "react"
import { Loader2, ShoppingCart } from "lucide-react"
import { IEventAPITicketTier } from "../../pages/Tickets"

interface PurchaseTierButtonProps {
  eventId: string
  ticketTier: IEventAPITicketTier
  quantity: number
  purchaserWalletAddress: string | null
  maxAvailable: number
  onPurchaseAttempt: (loading: boolean) => void
  onPurchaseSuccess: (data: any, purchasedQuantity: number, tierName: string) => void
  onPurchaseError: (error: any) => void
}

export const PurchaseTierButton = ({
  eventId,
  ticketTier,
  quantity,
  purchaserWalletAddress,
  maxAvailable,
  onPurchaseAttempt,
  onPurchaseSuccess,
  onPurchaseError,
}: PurchaseTierButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async () => {
    if (!purchaserWalletAddress) {
      alert("Please connect your wallet to purchase tickets.")
      return
    }
    if (!ticketTier._id) {
      alert("Ticket tier ID is missing.")
      return
    }
    if (quantity <= 0) {
      alert("Quantity must be at least 1.")
      return
    }
    if (quantity > maxAvailable) {
      alert(`Only ${maxAvailable} tickets available for this tier.`)
      return
    }

    setIsLoading(true)
    onPurchaseAttempt(true)
    try {
      const purchaseData = {
        eventId: eventId,
        ticketTierId: ticketTier._id.toString(),
        purchaserWalletAddress: purchaserWalletAddress,
        quantity: quantity,
      }

      const response = await fetch("https://ticketsevent.onrender.com/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.details || result.error || "Purchase failed")
      }
      onPurchaseSuccess(result.purchase, quantity, ticketTier.name)
    } catch (error: any) {
      console.error("Purchase error:", error)
      onPurchaseError(error)
    } finally {
      setIsLoading(false)
      onPurchaseAttempt(false)
    }
  }

  const soldOut = maxAvailable <= 0;

  return (
    <button
      onClick={handlePurchase}
      disabled={isLoading || !purchaserWalletAddress || soldOut || quantity <= 0 || quantity > maxAvailable}
      className={`mt-2 px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center w-full md:w-auto
        ${soldOut ? "bg-gray-400 cursor-not-allowed" : ""}
        ${(!soldOut && purchaserWalletAddress && !isLoading && quantity > 0 && quantity <= maxAvailable) ? "bg-blue-600 hover:bg-blue-700" : ""}
        ${(!soldOut && !purchaserWalletAddress) ? "bg-yellow-500 hover:bg-yellow-600" : ""}
        ${isLoading ? "bg-blue-400 cursor-wait" : ""}
        ${(quantity <=0 || quantity > maxAvailable) && !soldOut && purchaserWalletAddress ? "bg-red-400 cursor-not-allowed" : "" }
      `}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <ShoppingCart className="h-4 w-4 mr-2" />
      )}
      {soldOut ? "Sold Out" : isLoading ? "Processing..." : !purchaserWalletAddress ? "Connect Wallet" : (quantity <=0 || quantity > maxAvailable) ? "Invalid Qty" : `Buy (${(ticketTier.priceSOL * quantity).toFixed(2)} SOL)`}
    </button>
  )
}