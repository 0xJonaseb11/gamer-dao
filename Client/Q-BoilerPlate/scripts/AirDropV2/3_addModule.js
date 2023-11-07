const { getEncodedData } = require("@q-dev/gdk-sdk");
const { ethers } = require("hardhat");
require("dotenv").config();

const { MODULE_IMPLEMENTATION, MODULE_NAME, MAIN_DAO_VOTING_ADDRESS } = process.env;

// init main function
async function main() {

    // Retrieving eth accounts
    const accounts = await ethers.getSigners();
    const senderAddress = accounts[0].address;

    const GeneralDAOVotingFactory = await ethers.getContractFactory("GeneralDAOVoting");
    const VotingContract = GeneralDAOVotingFactory.attach(MAIN_DAO_VOTING_ADDRESS);
     
    // CREATE encoded data
    const addModulecalldata = getEncodedData("DAORegistry", "addProxyContract", MODULE_NAME, MODULE_IMPLEMENTATION);

    // create proposal
    console.log(`Create Proposal to add ${MODULE_NAME} Module to the DAO Registry`);
    await VotingContract.createProposal("DAORegistry", `Adding ${MODULE_NAME} To the DAO Contract Registry`, addModulecalldata, {
        from: senderAddress,
    });

    console.log("Proposal Created");

}