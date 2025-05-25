import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { mplTokenMetadata, createV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import { bundlrUploader } from '@metaplex-foundation/umi-uploader-bundlr';
import { generateSigner } from '@metaplex-foundation/umi';
import { percentAmount } from '@metaplex-foundation/umi';

const SOLANA_RPC_ENDPOINT = 'https://api.devnet.solana.com';
const BUNDLR_ADDRESS = 'https://devnet.bundlr.network';

export async function mintNftRequest(formData, wallet) {
    if (!wallet.publicKey || !wallet.signTransaction) {
        console.error("[API] Wallet not connected or does not support signing.");
        throw new Error("Wallet not connected or does not support signing.");
    }

    const { name, description, date, imageFile } = formData;
    if (!imageFile) {
        console.error("[API] Image file is required.");
        throw new Error("Image file is required for the NFT.");
    }

    const umi = createUmi(SOLANA_RPC_ENDPOINT)
        .use(walletAdapterIdentity(wallet))
        .use(mplTokenMetadata())
        .use(bundlrUploader({
            address: BUNDLR_ADDRESS,
            timeout: 60000,
        }));

    try {
        const imageBuffer = await imageFile.arrayBuffer();
        const umiImage = {
            buffer: new Uint8Array(imageBuffer),
            fileName: imageFile.name,
            displayName: name,
            uniqueName: `${imageFile.name}-${Date.now()}`,
            contentType: imageFile.type || 'image/png',
        };

        const metadataToUpload = {
            name: name,
            description: description,
            image: umiImage,
            attributes: [
                { trait_type: "Event Date", value: date },
            ],
        };

        const metadataUri = await umi.uploader.uploadJson(metadataToUpload);

        const mint = generateSigner(umi);

        const createNftTransaction = await createV1(umi, {
            mint: mint,
            authority: umi.identity,
            name: name,
            uri: metadataUri,
            sellerFeeBasisPoints: percentAmount(0, 2),
            isMutable: true,
            tokenStandard: TokenStandard.NonFungible,
        }).sendAndConfirm(umi, { confirm: { commitment: 'confirmed' } });

        return {
            mint: mint.publicKey.toString(),
            metadataUri: metadataUri,
        };

    } catch (error) {
        console.error("[API] Error in mintNftRequest:", error);
        if (error.cause) {
            console.error("[API] Error cause:", error.cause);
        }
        if (error.message.toLowerCase().includes("bundlr") && error.message.toLowerCase().includes("balance")) {
            throw new Error("Bundlr insufficient balance. Please ensure your Devnet wallet has enough SOL for storage fees or try airdropping more SOL to your Bundlr Devnet account via their interface if direct funding is low.");
        }
        throw error;
    }
}

export async function getUserNfts() {
    return []
}
