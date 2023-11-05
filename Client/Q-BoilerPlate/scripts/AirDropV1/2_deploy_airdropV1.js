const { ethers }  = require("hardhat");
Web3 = require("web3");
const keccak256 = require("keccak256");
const { merkleTree, default: MerkleTree } = require("merkletreejs");
const fs = require("fs");
const { root } = require("postcss");

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