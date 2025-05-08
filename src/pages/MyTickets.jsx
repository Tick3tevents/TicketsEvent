import React, { useEffect, useState } from 'react';
import { getUserNfts } from '../services/api';

export default function MyTickets() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNFTs() {
      try {
        const result = await getUserNfts(); // В будущем — по ID пользователя или сессии
        setNfts(result);
      } catch (err) {
        console.error("Ошибка загрузки NFT:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNFTs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Мои билеты</h2>
      {loading && <p>Загрузка...</p>}
      {!loading && nfts.length === 0 && <p>Нет NFT</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nfts.map((nft) => (
          <div key={nft.mint} className="border p-4 rounded">
            <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover mb-2" />
            <h3 className="text-lg font-semibold">{nft.name}</h3>
            <p>{nft.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
