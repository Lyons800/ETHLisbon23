// moralisAPI.js
import Moralis from "moralis";

Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY }); // Start Moralis once

// Fetch all NFTs for a given contract
export async function getContractNFTs(chain: any, address: any) {
  try {
    const response = await Moralis.EvmApi.nft.getContractNFTs({
      chain,
      format: "decimal",
      address,
    });
    if (response) {
      return response.raw;
    } else {
      throw new Error("Response is null");
    }
  } catch (e) {
    console.error(e);
    throw e; // Re-throw the error so that the calling function can handle it
  }
}

// Fetch metadata for a specific NFT
export async function getNFTMetadata(chain: any, address: any, tokenId: any) {
  try {
    const response = await Moralis.EvmApi.nft.getNFTMetadata({
      chain,
      format: "decimal",
      normalizeMetadata: true,
      mediaItems: false,
      address,
      tokenId,
    });
    if (response) {
      return response.raw;
    } else {
      throw new Error("Response is null");
    }
  } catch (e) {
    console.error(e);
    throw e; // Re-throw the error so that the calling function can handle it
  }
}
