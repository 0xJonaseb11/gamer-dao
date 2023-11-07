// Importing the necessary libraries
const { ethers } = require("hardhat");

// The main function for deploying the Airdrop module
async function main() {
  // Display a message to indicate the start of the deployment
  console.log("Deploying AirDrop V2");

  // Deploying AirDrop V2 contract
  const AirDropV2 = await ethers.getContractFactory("AirDropV2"); // Get the contract factory
  const airdropV2 = await AirDropV2.deploy(); // Deploy the AirdropV2 contract

  // Waiting for deployment confirmation
  await airdropV2.waitForDeployment();

  // Getting the deployed AirdropV2 contract address
  const airdropAddress = await airdropV2.getAddress();

  // Log the contract address to the console
  console.log("AirDrop V2 deployed to:", airdropAddress);
}

// Call the main function to deploy the Airdrop module
main();
