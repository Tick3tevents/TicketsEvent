import { useState } from 'react';
import React from 'react';
export default function MintForm({ onMint }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Пожалуйста, выберите изображение');

    const metadata = {
      name,
      date,
      description,
      imageFile: file
    };

    onMint(metadata);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4 animate-fadeIn">
      <div>
        <label className="block mb-1 font-medium">Название события</label>
        <input
          type="text"
          className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Дата</label>
        <input
          type="date"
          className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Описание</label>
        <textarea
          className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Изображение (афиша)</label>
        <input
          type="file"
          accept="image/*"
          className="w-full"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
      </div>

      <button
        type="submit"
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
      >
        Минт NFT
      </button>
    </form>
  );
}
