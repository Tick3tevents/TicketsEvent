import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import {
  Metaplex,
  irysStorage,
  keypairIdentity
} from "@metaplex-foundation/js";

const connection = new Connection(clusterApiUrl("devnet"));

export async function mintNFTWithMetadata(wallet, metadata) {
  const { imageFile, name, description, date } = metadata;

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet.adapter))
    .use(
      irysStorage({
        address: "https://devnet.irys.xyz",
        providerUrl: clusterApiUrl("devnet"),
        timeout: 60000
      })
    );

  // Загружаем изображение
  const imageUri = await metaplex.storage().upload(imageFile);

  // Создаём JSON метаданные
  const metadataUri = await metaplex.storage().uploadJson({
    name,
    description,
    image: imageUri,
    attributes: [
      { trait_type: "Дата события", value: date },
      { trait_type: "Организатор", value: wallet.publicKey.toBase58() }
    ]
  });

  // Минтим NFT
  const { nft } = await metaplex.nfts().create({
    uri: metadataUri,
    name,
    sellerFeeBasisPoints: 500,
    symbol: "TKT",
    creators: [{ address: wallet.publicKey, share: 100 }]
  });

  return nft;
}