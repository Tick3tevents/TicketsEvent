import { useWallet } from '@solana/wallet-adapter-react';

export default function useSolanaWallet() {
  const wallet = useWallet();
  return wallet;
}
