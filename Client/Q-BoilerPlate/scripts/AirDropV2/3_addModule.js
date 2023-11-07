const { getEncodedData } = require("@q-dev/gdk-sdk");
const { ethers } = require("hardhat");
require('dotenv').config();

// Retrieving environment variables
const { MODULE_IMPLEMENTATION, MODULE_NAME, MAIN_DAO_VOTING_ADDRESS } = process.env;

async function main() {

  // Retrieving Ethereum accounts
  const accounts = await ethers.getSigners();
  const senderAddress = accounts[0].address;

  // Get the contract factories for GeneralDAOVoting
  const GeneralDAOVotingFactory = await ethers.getContractFactory("GeneralDAOVoting");

  // Attach to existing instances of GeneralDAOVoting
  const VotingContract = GeneralDAOVotingFactory.attach(MAIN_DAO_VOTING_ADDRESS);

  // Creating encoded calldata to add the new module to the DAO Registry
  const addModuleCalldata = getEncodedData("DAORegistry", "addProxyContract", MODULE_NAME, MODULE_IMPLEMENTATION);

  // Creating a voting proposal to add the module to the DAO Registry
  console.log(`Create Proposal to add ${MODULE_NAME} module to the DAO Registry`);
  await VotingContract.createProposal("DAORegistry", `Adding ${MODULE_NAME} to the DAO Contract Registry`, addModuleCalldata, {        
    from: senderAddress,
  });

  console.log("Proposal Created");
}

main();
