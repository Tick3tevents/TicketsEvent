import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import MintForm from '../components/MintForm';
import { mintNftRequest } from '../services/api';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function EventDetails() {
  const { id: eventId } = useParams();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [mintedNftInfo, setMintedNftInfo] = useState(null);
  const wallet = useWallet();

  useEffect(() => {
    setFeedback({ type: '', message: '' });
    setMintedNftInfo(null);
  }, [wallet.connected]);

  const handleMint = async (formData) => {
    if (!wallet.connected || !wallet.publicKey) {
      const msg = 'Пожалуйста, подключите ваш Solana кошелек!';
      setFeedback({ type: 'error', message: msg });
      alert(msg);
      return;
    }
    if (!formData.imageFile) {
      const msg = 'Пожалуйста, загрузите изображение для NFT!';
      setFeedback({ type: 'error', message: msg });
      alert(msg);
      return;
    }

    setLoading(true);
    setFeedback({ type: 'info', message: '⏳ Идет процесс создания NFT... Это может занять некоторое время (особенно загрузка изображения на Devnet).' });
    setMintedNftInfo(null);

    try {
      const result = await mintNftRequest(formData, wallet);

      if (result && result.mint) {
        const successMsg = `✅ NFT для события #${eventId} успешно создан! Адрес: ${result.mint}`;
        setFeedback({ type: 'success', message: successMsg });
        setMintedNftInfo({
          mintAddress: result.mint,
          metadataUri: result.metadataUri,
          explorerUrl: `https://explorer.solana.com/address/${result.mint}?cluster=devnet`
        });
        alert(successMsg);
      } else {
        throw new Error("Minting completed but no valid result was returned.");
      }

    } catch (error) {
      console.error("[EventDetails] Ошибка при минтинге:", error);
      let userErrorMessage = `❌ Ошибка при создании NFT: ${error.message || "Неизвестная ошибка"}`;
      setFeedback({ type: 'error', message: userErrorMessage });
      alert(userErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-2">Событие #{eventId}</h1>
      <p className="text-center text-gray-600 mb-6">Создайте памятный NFT для этого события (в сети Devnet).</p>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">1. Подключите кошелек (Devnet)</h2>
        <div className="mb-3">
          <WalletMultiButton style={{ backgroundColor: '#512da8', color: 'white', width: '100%' }} />
        </div>
        {wallet.connected && (
          <p className="text-sm text-green-600">
            Кошелек подключен (Devnet): {wallet.publicKey.toBase58().substring(0, 6)}...{wallet.publicKey.toBase58().slice(-6)}
          </p>
        )}
      </div>

      {wallet.connected ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">2. Заполните данные и создайте NFT</h2>
          <MintForm onSubmit={handleMint} />
        </div>
      ) : (
        <p className="text-center text-red-500 font-semibold p-4 bg-red-50 rounded-md">
          Пожалуйста, подключите кошелек (убедитесь, что он в сети Devnet), чтобы создать NFT.
        </p>
      )}

      {feedback.message && (
        <div className={`mt-6 p-4 rounded-md text-center font-medium break-words
          ${feedback.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : ''}
          ${feedback.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' : ''}
          ${feedback.type === 'info' ? 'bg-blue-100 text-blue-800 border border-blue-300' : ''}`}>
          {feedback.message}
        </div>
      )}

      {mintedNftInfo && feedback.type === 'success' && (
        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-300 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">Информация о созданном NFT (Devnet):</h3>
          <p className="text-sm"><strong>Адрес NFT (Mint):</strong>
            <a href={mintedNftInfo.explorerUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline ml-1 break-all">
              {mintedNftInfo.mintAddress}
            </a>
          </p>
          {mintedNftInfo.metadataUri && (
            <p className="text-sm"><strong>URI Метаданных:</strong>
              <a href={mintedNftInfo.metadataUri} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline ml-1 break-all">
                {mintedNftInfo.metadataUri}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
