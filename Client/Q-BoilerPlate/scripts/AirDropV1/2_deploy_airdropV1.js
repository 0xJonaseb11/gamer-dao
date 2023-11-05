const { ethers }  = require("hardhat");
Web3 = require("web3");
const keccak256 = require("keccak256");
const { merkleTree } = require("merkletreejs");
const fs = require("fs");

/// add contracts
const qrc20Address = "0x98229ae26542F6061b69159a628e2990De12A7fA";
const QRC20 = await ethers.getContractFactory("QRC20");
const contract = QRC20.attach(qrc20Address);
