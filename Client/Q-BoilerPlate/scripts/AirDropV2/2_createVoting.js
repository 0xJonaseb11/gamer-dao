const { getEncodedData } = require("@q-dev/gdk-sdk");
const { ethers } = require("hardhat");
require("dotenv").config();
const{ MODULE_NAME, MAIN_DAO_VOTING_ADDRESS, VOTING_CONTRACT_ADDRESS, TEN_PERCENTAGE, DAO_REGISTRY_NAME } = process.env;
