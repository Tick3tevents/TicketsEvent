import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');

export async function sendSolanaTransaction(senderPublicKey, receiverPublicKey, amount) {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderPublicKey,
      toPubkey: receiverPublicKey,
      lamports: amount,
    }),
  );
  return transaction;
}