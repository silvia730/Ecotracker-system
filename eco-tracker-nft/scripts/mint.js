const hre = require("hardhat");

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const nft = await hre.ethers.getContractAt(
    "EcoTrackerNFT", 
    process.env.NFT_CONTRACT_ADDRESS
  );

  // Mint NFT to owner
  await nft.safeMint(owner.address);
  console.log("Minted NFT to:", owner.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});