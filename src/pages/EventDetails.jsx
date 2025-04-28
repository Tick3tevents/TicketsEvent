import { useParams } from 'react-router-dom';
import { mintTicketNFT } from '../services/nftService';
import useSolanaWallet from '../hooks/useWallet';

export default function EventDetails() {
  const { id } = useParams();
  const wallet = useSolanaWallet();

  const handleMint = async () => {
    if (!wallet.connected) return alert('Подключите кошелек');
    await mintTicketNFT(wallet.publicKey, id);
    alert('Билет успешно выпущен!');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Детали События {id}</h1>
      <button 
        onClick={handleMint} 
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
      >
        Купить Билет
      </button>
    </div>
  );
}
