import React from 'react';
import { Link } from 'react-router-dom';
import ConnectWalletButton from './ConnectWalletButton';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 transition-all">
      <Link to="/" className="text-xl font-bold dark:text-white">Tick3t</Link>
      <div className="flex gap-4">
        <Link to="/my-tickets" className="text-gray-700 dark:text-gray-300">Мои Билеты</Link>
        <ConnectWalletButton />
      </div>
    </nav>
  );
}

