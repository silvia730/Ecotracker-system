const { Web3 } = require('web3');
const fs = require('fs');
require('dotenv').config();

const RPC_URL = 'https://rpc-amoy.polygon.technology'; // Amoy testnet official RPC
const CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS; // Set this in your .env
const ABI = require('../../eco-tracker-nft/artifacts/contracts/EcoTrackerNFT.sol/EcoTrackerNFT.json').abi;

const web3 = new Web3(RPC_URL);
const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

// Get the owner of a tokenId
async function getOwner(tokenId) {
  return await contract.methods.ownerOf(tokenId).call();
}

// Mint a new NFT (requires private key)
async function mintNFT(to, tokenURI, privateKey) {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  const tx = contract.methods.mint(to, tokenURI);
  const gas = await tx.estimateGas({ from: account.address });
  const data = tx.encodeABI();
  const txData = {
    from: account.address,
    to: CONTRACT_ADDRESS,
    data,
    gas,
  };

  const receipt = await web3.eth.sendTransaction(txData);
  return receipt;
}

module.exports = { getOwner, mintNFT }; 