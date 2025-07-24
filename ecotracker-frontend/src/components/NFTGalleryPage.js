import React, { useEffect, useState } from 'react';
import { Box, Heading, SimpleGrid, Text, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { ethers } from "ethers";

const NFT_CONTRACT_ADDRESS = "0xE10C0C4076F3d2dFa27A1dA38901cf2Ba74b89eD";
const NFT_ABI = [
  // Replace this with your actual contract ABI if different
  "function claim() public"
];

const handleClaim = async () => {
  try {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);

    const tx = await contract.claim();
    await tx.wait();
    alert("NFT claimed! Check your wallet.");
  } catch (err) {
    console.error(err);
    alert("Claim failed: " + (err?.reason || err?.message || "Unknown error"));
  }
};

const NFTGalleryPage = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use wallet address from localStorage or user profile if available
        const WALLET_ADDRESS = localStorage.getItem('ecotrackerWalletAddress');
        if (!WALLET_ADDRESS) {
          setNfts([]);
          setLoading(false);
          return;
        }
        const ALCHEMY_API_KEY = "iICsptvaj6Bib7TYvghNKHhkVhWgGJAL";
        const url = `https://polygon-amoy.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getNFTsForOwner?owner=${WALLET_ADDRESS}&withMetadata=true`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch NFTs');
        const data = await res.json();
        setNfts(data.ownedNfts || []);
      } catch (err) {
        setError('Failed to fetch NFTs');
      } finally {
        setLoading(false);
      }
    };
    fetchNFTs();
  }, []);

  return (
    <Box maxW="900px" mx="auto" mt={8} p={6} borderWidth={1} borderRadius={16} boxShadow="lg" bg="white">
      <Heading as="h2" size="lg" mb={4}>NFT Gallery</Heading>
      {loading ? (
        <Spinner size="lg" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : nfts.length === 0 ? (
        <>
          <Text>No NFTs found for this wallet on Amoy testnet.</Text>
          <button
            style={{ marginTop: 20, background: '#38a169', color: 'white', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            onClick={handleClaim}
          >
            Claim
          </button>
        </>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {nfts.map(nft => {
            const meta = nft.rawMetadata || {};
            const image = meta.image || 'https://via.placeholder.com/100';
            const name = meta.name || `Token #${nft.tokenId}`;
            const description = meta.description || '';
            const contract = nft.contract.address;
            const tokenId = nft.tokenId;
            return (
              <Box key={contract + tokenId} borderWidth={1} borderRadius={12} p={4} textAlign="center">
                <img src={image} alt={name} style={{ width: 100, height: 100, margin: '0 auto' }} />
                <Text fontWeight="bold" mt={2}>{name}</Text>
                <Text fontSize="sm" color="gray.500">{description}</Text>
                <a
                  href={`https://testnets.opensea.io/assets/amoy/${contract}/${tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#3182ce", textDecoration: "underline", display: "block", marginTop: 8 }}
                >
                  View on OpenSea
                </a>
                <button
                  style={{ marginTop: 12, background: '#38a169', color: 'white', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={handleClaim}
                >
                  Claim
                </button>
              </Box>
            );
          })}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default NFTGalleryPage; 