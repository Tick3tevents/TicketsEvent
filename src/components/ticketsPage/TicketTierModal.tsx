import { useState, useEffect, useCallback } from "react";
import { X, CheckCircle, AlertTriangle, MinusCircle, PlusCircle } from "lucide-react";
import { PurchaseTierButton } from "./PurchaseTierButton";
import { FrontendTicket } from "../../pages/Tickets";

interface TicketTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: FrontendTicket | null;
  purchaserWalletAddress: string | null;
  onSuccessfulPurchase?: () => void;
}

type PurchaseStatus = 'idle' | 'loading' | 'success' | 'error';

export const TicketTierModal = ({
  isOpen,
  onClose,
  event,
  purchaserWalletAddress,
  onSuccessfulPurchase,
}: TicketTierModalProps) => {
  const [tierQuantities, setTierQuantities] = useState<{ [tierId: string]: number }>({});
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>('idle');
  const [purchaseMessage, setPurchaseMessage] = useState<string>("");
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

  const handleCloseAndReset = useCallback(() => {
      setTimeout(() => {
          setPurchaseStatus('idle');
          setPurchaseMessage('');
          if (event?.originalEvent.ticketTiers) {
              const initialQuantities: { [key: string]: number } = {};
              event.originalEvent.ticketTiers.forEach(tier => {
                  if (tier._id) {
                      initialQuantities[tier._id.toString()] = 1;
                    }
                });
                setTierQuantities(initialQuantities);
            }
        }, 5000);
        onClose();
    }, [onClose, event]);
    
  useEffect(() => {
    if (isOpen && event?.originalEvent.ticketTiers) {
      const initialQuantities: { [key: string]: number } = {};
      event.originalEvent.ticketTiers.forEach(tier => {
        if (tier._id) {
          initialQuantities[tier._id.toString()] = 1;
        }
      });
      setTierQuantities(initialQuantities);
      if (purchaseStatus !== 'success' && purchaseStatus !== 'error') {
        setPurchaseStatus('idle');
        setPurchaseMessage("");
      }
    }
  }, [event, isOpen]);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (purchaseStatus === 'success') {
      timer = setTimeout(() => {
        handleCloseAndReset();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [purchaseStatus, handleCloseAndReset]);


  const handleQuantityChange = (tierId: string, newQuantity: number, maxAvailable: number) => {
    const validatedQuantity = Math.max(1, Math.min(newQuantity, maxAvailable > 0 ? maxAvailable : 1));
    setTierQuantities(prev => ({ ...prev, [tierId]: validatedQuantity }));
  };

  const incrementQuantity = (tierId: string, maxAvailable: number) => {
    setTierQuantities(prev => ({
        ...prev,
        [tierId]: Math.min((prev[tierId] || 0) + 1, maxAvailable > 0 ? maxAvailable : 1)
    }));
  };

  const decrementQuantity = (tierId: string) => {
    setTierQuantities(prev => ({
        ...prev,
        [tierId]: Math.max(1, (prev[tierId] || 1) - 1)
    }));
  };

  const handlePurchaseAttempt = (loading: boolean) => {
    setIsButtonLoading(loading);
  };
  
  const handlePurchaseSuccess = (data: any, purchasedQuantity: number, tierName: string) => {
    setPurchaseStatus('success');
    setPurchaseMessage(`You've got ${purchasedQuantity} x ${tierName} ticket${purchasedQuantity > 1 ? 's' : ''}! Tx: ${data?.transactionSignature?.substring(0,10)}...` || 'Details in console.');
    if (onSuccessfulPurchase) {
        onSuccessfulPurchase(); 
    }
  };

  const handlePurchaseError = (error: any) => {
    setPurchaseStatus('error');
    setPurchaseMessage(error.message || "An error occurred. Please try again.");
  };


  if (!isOpen || !event) return null;

  const renderContent = () => {
    switch (purchaseStatus) {
      case 'success':
        return (
          <div className="text-center py-8 flex flex-col items-center justify-center min-h-[200px]">
            <div className="animate-success-pop">
              <CheckCircle className="h-20 w-20 sm:h-24 sm:w-24 text-green-500 mb-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">Purchase Successful!</h3>
            <p className="text-gray-600 text-sm px-4 break-all">{purchaseMessage}</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center py-8 flex flex-col items-center justify-center min-h-[200px]">
            <AlertTriangle className="h-16 w-16 sm:h-20 sm:w-20 text-red-500 mb-6" />
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">Purchase Failed</h3>
            <p className="text-red-600 text-sm px-4">{purchaseMessage}</p>
            <button onClick={() => setPurchaseStatus('idle')} className="mt-8 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Try Again
            </button>
          </div>
        );
      case 'idle':
      case 'loading':
      default:
        return (
          <>
            {event.originalEvent.ticketTiers && event.originalEvent.ticketTiers.length > 0 ? (
              <ul className="space-y-4">
                {event.originalEvent.ticketTiers.map((tier) => {
                  const tierIdStr = tier._id?.toString();
                  if (!tierIdStr) return null;
                  const remainingSupply = Math.max(0, (tier.supply ?? 0) - (tier.ticketsSold ?? 0));
                  const currentQuantity = tierQuantities[tierIdStr] || 1;
                  const maxQtyForThisTier = remainingSupply;
                  
                  return (
                    <li key={tierIdStr} className={`border rounded-lg p-4 shadow-sm transition-all duration-150 ${isButtonLoading ? 'opacity-70 pointer-events-none' : ''}`}>
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-700">{tier.name}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{tier.description || "No description."}</p>
                          <p className="text-md font-bold text-blue-600 mt-2">{tier.priceSOL.toFixed(2)} SOL</p>
                          {tier.supply !== undefined && (
                            <p className="text-xs text-gray-500 mt-1">
                              Available: {remainingSupply} / {tier.supply}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0 mt-3 sm:mt-0 sm:ml-4 flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <button onClick={() => decrementQuantity(tierIdStr)} disabled={currentQuantity <= 1 || remainingSupply === 0 || isButtonLoading} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"> <MinusCircle className="h-5 w-5 text-gray-700"/> </button>
                            <input
                              type="number"
                              value={currentQuantity}
                              onChange={(e) => handleQuantityChange(tierIdStr, parseInt(e.target.value) || 1, maxQtyForThisTier)}
                              onBlur={(e) => handleQuantityChange(tierIdStr, parseInt(e.target.value) || 1, maxQtyForThisTier)}
                              min="1"
                              max={maxQtyForThisTier === 0 ? 1 : maxQtyForThisTier} // Prevent setting > 0 if max is 0
                              disabled={remainingSupply === 0 || isButtonLoading}
                              className="w-16 text-center border border-gray-300 rounded-md p-1.5 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <button onClick={() => incrementQuantity(tierIdStr, maxQtyForThisTier)} disabled={currentQuantity >= maxQtyForThisTier || remainingSupply === 0 || isButtonLoading} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"> <PlusCircle className="h-5 w-5 text-gray-700"/> </button>
                          </div>
                          <PurchaseTierButton
                            eventId={event.id}
                            ticketTier={tier}
                            quantity={currentQuantity}
                            purchaserWalletAddress={purchaserWalletAddress}
                            maxAvailable={remainingSupply}
                            onPurchaseAttempt={handlePurchaseAttempt}
                            onPurchaseSuccess={handlePurchaseSuccess}
                            onPurchaseError={handlePurchaseError}
                          />
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-gray-600 text-center py-4">No ticket tiers currently available for this event.</p>
            )}
             <button onClick={handleCloseAndReset} disabled={isButtonLoading} className="mt-6 w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-70">
                Cancel
            </button>
          </>
        );
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 line-clamp-2 break-words">
             {purchaseStatus === 'success' ? 'Purchase Successful' : 
             purchaseStatus === 'error' ? 'Purchase Attempt Failed' : 
             `Buy Tickets: ${event.title}`}
          </h2>
          <button onClick={handleCloseAndReset} disabled={purchaseStatus === 'success'} className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors disabled:opacity-50">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};