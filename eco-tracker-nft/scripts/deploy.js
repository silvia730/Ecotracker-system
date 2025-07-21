// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  const baseURI = "https://api.yourdomain.com/nft-metadata/";
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying with account:", deployer.address);
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MATIC");

  // Use fixed gas price instead of current market rate
  const manualGasPrice = ethers.parseUnits("30", "gwei");
  console.log("Using fixed gas price:", ethers.formatUnits(manualGasPrice, "gwei"), "gwei");

  // Deploy with conservative gas settings
  const EcoTrackerNFT = await ethers.getContractFactory("EcoTrackerNFT");
  const nft = await EcoTrackerNFT.deploy(baseURI, {
    gasPrice: manualGasPrice,
    gasLimit: 3_000_000  // Reduced from 5M to 3M
  });

  console.log("Deployment transaction sent:", nft.deploymentTransaction().hash);
  await nft.waitForDeployment();
  
  console.log("NFT deployed to:", await nft.getAddress());
  console.log("Add to .env:\nNFT_CONTRACT_ADDRESS=" + await nft.getAddress());
}

main().catch(console.error);