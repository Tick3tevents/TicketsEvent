import { useState } from 'react';
import React from 'react';
export default function UpdateForm({ onUpdate }) {
  const [mint, setMint] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const metadata = {
      name,
      description,
      image,
      attributes: [
        { trait_type: 'Обновлён', value: 'Да' },
        { trait_type: 'Время', value: new Date().toISOString() }
      ]
    };

    onUpdate(mint, metadata);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4">
      <h2 className="text-xl font-semibold">Обновить NFT-билет</h2>

      <input
        type="text"
        placeholder="Mint-адрес NFT"
        className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700"
        value={mint}
        onChange={(e) => setMint(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Новое имя"
        className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Новое описание"
        className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Ссылка на новое изображение"
        className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        required
      />

      <button
        type="submit"
        className="px-6 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600"
      >
        Обновить метаданные
      </button>
    </form>
  );
}
