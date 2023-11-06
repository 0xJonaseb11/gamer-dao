
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
web3 = require("web3"); 
const fs = require("fs");

async function main () {
    
    // address of deployed aidrop contract
    const Airdrop = "0x604d5f96Fd498647FD2C2Bf1E14E952db1409F22";
    const Airdrop_fac = await ethers.getContractFactory("AirDropV1");

    // attach contract instance to the deployed contract
    const contract = Airdrop_fac.attach(Airdrop);

    

}

main();