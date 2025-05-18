import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function ConnectWalletButton() {
  return (
    <WalletMultiButton className="!bg-indigo-600 !text-white !rounded-lg" />
  );
}
