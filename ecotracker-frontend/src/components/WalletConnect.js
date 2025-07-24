import React, { useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { Button, Box, Text } from '@chakra-ui/react';

const WalletConnect = ({ onWalletConnected }) => {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        if (onWalletConnected) onWalletConnected(accounts[0]);
      } catch (err) {
        alert('User rejected wallet connection');
      }
    } else {
      alert('MetaMask not detected. Please install MetaMask.');
    }
  };

  return (
    <Box mb={4}>
      {walletAddress ? (
        <Text fontWeight="bold">Connected: {walletAddress}</Text>
      ) : (
        <Button colorScheme="orange" onClick={connectWallet}>
          Connect MetaMask
        </Button>
      )}
    </Box>
  );
};

export default WalletConnect; 