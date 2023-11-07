const { ethers }  = require("hardhat");
Web3 = require("web3");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
const fs = require("fs");


async function main () {

/// add contracts
const qrc20Address = "0x98229ae26542F6061b69159a628e2990De12A7fA";
const QRC20 = await ethers.getContractFactory("QRC20");
const contract = QRC20.attach(qrc20Address);

// creating merkle tree
let addresses = [
    {
        addr: "0x1F334285EfdbE58034d3F24DD0703672E0741f00"
    },
];

const leafNodes = addresses.map((address) => keccak256(
    Buffer.from(address.addr.replace("0x", ""), "hex"),
));

const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true});
root = merkleTree.getRoot();

const data = {
    addresses: addresses.map((address) => address.addr),
    leafNodes: leafNodes,
    root: root,
};

fs.writeFileSync("tree.json", JSON.stringify(data, null, 2));


// Deploying contract
console.log("Deploying AirdropV1...");

const AirDropV1 = await ethers.getContractFactory("AirDropV1");
const dropAmt = Web3.utils.toWei("20", "ether");
const airdrop = await AirDropV1.deploy();

console.log("AirDropV1 deployed to: ", await airdrop.getAddress());

await airdrop.create_airdrop(qrc20Address, dropAmt, root);

console.log("Funding the Airdrop...");


// mint tokens
const airdropAddress =  airdrop.getAddress();
const mintAmount = Web3.utils.toWei("2000", "ether");

await contract.mintTo(airdropAddress, mintAmount);

console.log("Airdrop Funded...");

}

main();