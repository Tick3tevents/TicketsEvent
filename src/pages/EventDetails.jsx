import React from 'react';
import { useParams } from 'react-router-dom';
import MintForm from '../components/MintForm';
import { mintNFTWithMetadata } from '../services/nftService';
import useSolanaWallet from '../hooks/useWallet';

export default function EventDetails() {
  const { id } = useParams();
  const wallet = useSolanaWallet();

  const handleMint = async (metadata) => {
    if (!wallet.connected) {
      alert('Подключите кошелек');
      return;
    }

    try {
      const result = await mintNFTWithMetadata(wallet, metadata);
      if (result) alert('NFT успешно создан!');
    } catch (err) {
      alert('Ошибка при минтовании');
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Минт NFT-билет для события #{id}</h1>
      <MintForm onMint={handleMint} />
    </div>
  );
}
