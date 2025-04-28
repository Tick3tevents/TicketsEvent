import { Link } from 'react-router-dom';
import ConnectWalletButton from './ConnectWalletButton';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow">
      <Link to="/" className="text-xl font-bold">Tick3t</Link>
      <div className="flex gap-4">
        <Link to="/my-tickets" className="text-gray-700">Мои Билеты</Link>
        <ConnectWalletButton />
      </div>
    </nav>
  );
}
