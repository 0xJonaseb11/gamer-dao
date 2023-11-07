
const { ethers } = require("hardhat");
require('dotenv').config();

// Load environment variables
const { MODULE_NAME, DAO_REGISTRY_ADDRESS, VOTING_CONTRACT_ADDRESS } = process.env;

// initialize the AirDropV2 module
async function main() {

    // Get Ethereum accounts from Hardhat
    const accounts = await ethers.getSigners();
    const senderAddress = accounts[0].address;

    // Get the contract factories for DAORegistry and AirDropV2
    const DAORegistryFactory = await ethers.getContractFactory("DAORegistry");
    const AirDropV2Factory = await ethers.getContractFactory("AirDropV2");

    // Attach to existing instances of DAORegistry and AirDropV2
    const daoRegistry = DAORegistryFactory.attach(DAO_REGISTRY_ADDRESS);
    const AirDropProxy = AirDropV2Factory.attach(await daoRegistry.getContract(MODULE_NAME));

    // Initialize the AirDropV2 module
    console.log(`Initialize ${MODULE_NAME}`);
    await AirDropProxy.__AirDropV2_init(VOTING_CONTRACT_ADDRESS, {        
        from: senderAddress,
    });

    console.log(`Initialized ${MODULE_NAME}`);
}

main();
