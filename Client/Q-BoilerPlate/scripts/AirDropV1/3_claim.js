const { ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
web3 = require('web3');
const fs = require("fs");

async function main() {
	// Define the address of the deployed Airdrop contract
	const Airdrop = "YOUR-AIRDROP-CONTRACT-ADDRESS";
	// Get the Contract Factory for the Airdrop contract
	const Airdrop_fac = await ethers.getContractFactory("AirDropV1");
	// Attach the Contract instance to the deployed Airdrop contract
	const contract = Airdrop_fac.attach(Airdrop);

	// Get the signer accounts (Ethereum addresses with signing capabilities)
	const accounts = await ethers.getSigners();
	// Get the Ethereum address of the caller (claimer)
	const claimAddress = accounts[0].address;

	// Read and parse Merkle tree data from the 'tree.json' file
	const jsonData = fs.readFileSync('tree.json', 'utf-8');
	const data = JSON.parse(jsonData);
	const leafNodes = data.leafNodes.map((node) => Buffer.from(node, 'hex'));
	// Create a Merkle tree from the leaf nodes
	const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

	// Display the Merkle tree structure
	console.log("---------");
	console.log("Merkle Tree");
	console.log("---------");
	console.log(merkleTree.toString());

	// Generate Merkle proofs for all leaf nodes
	const proofArray = leafNodes.map((node) =>
	  merkleTree.getHexProof(node)
	);

	console.log("Claiming Airdrop");

	// Initialize a flag to track whether the airdrop has been claimed
	let isClaimed = false;
	// Loop through each proof and attempt to claim airdrop
	for (let i = 0; i < proofArray.length; i++) {
	  // Check if the caller's address is whitelisted for this proof
	  const isWhitelisted = await contract.isWhitelistedUser(claimAddress, proofArray[i]);
	  
	  // If whitelisted, claim the airdrop reward
	  if (isWhitelisted) {
	    await contract.claimReward(claimAddress, proofArray[i]);
	    console.log("Claimed Airdrop for address:", claimAddress);
	    isClaimed = true; // Set the flag to true
	    break; // Exit the loop
	  }
	}

	// If the airdrop was not claimed, print a message
  if (!isClaimed) {
    console.log("Not a whitelisted user.");
  }

}

main();
