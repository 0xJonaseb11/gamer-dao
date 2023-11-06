
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree, default: MerkleTree } = require("merkletreejs");
web3 = require("web3"); 
const fs = require("fs");

async function main () {
    
    // address of deployed aidrop contract
    const Airdrop = "0x604d5f96Fd498647FD2C2Bf1E14E952db1409F22";
    const Airdrop_fac = await ethers.getContractFactory("AirDropV1");

    // attach contract instance to the deployed contract
    const contract = Airdrop_fac.attach(Airdrop);

    // Getting the caller address
    const accounts =  await ethers.getSigners();
    const claimAddress = accounts[0].address;

    // Read and parse Merkle tree data from the "tree.json" file
    const jsonData = fs.readFileSync("tree.json", "utf-8");
    const data = JSON.parse(jsonData);
    const leafNodes = data.leafNodes.map((node) => Buffer.from(node, "hex"));

    // create a merkle tree from the leaf nodes
    const MerkleTree = new MerkleTree(leafNodes, keccak256, {sortParis: true});

    
    // Print Merkle tree
    // display merkle tree structure
    console.log("-----------------");
    console.log("Merkle Tree");
    console.log("-----------------");
    console.log(MerkleTree.toString());

    

}

main();