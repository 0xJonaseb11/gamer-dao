// Importing dependencies
const { getEncodedData } = require("@q-dev/gdk-sdk");
const { ethers } = require("hardhat");
require('dotenv').config();
const { MODULE_NAME, MAIN_DAO_VOTING_ADDRESS, VOTING_CONTRACT_ADDRESS, TEN_PERCENTAGE, DAO_REGISTRY_NAME } = process.env;

// Function to create a voting situation object
function buildVotingSituation(name, target) {
  return {
    votingSituationName: name,
    votingValues: {
      votingPeriod: 300,
      vetoPeriod: 60,
      proposalExecutionPeriod: 1000,
      requiredQuorum: TEN_PERCENTAGE,
      requiredMajority: TEN_PERCENTAGE,
      requiredVetoQuorum: TEN_PERCENTAGE,
      votingType: 0,
      votingTarget: target,
      votingMinAmount: 1,
    },
  };
}

// The main function for deploying voting proposals
async function main() {
    // Retrieve Ethereum accounts
    const accounts = await ethers.getSigners();
    const senderAddress = accounts[0].address;

    // Get the contract factories for GeneralDAOVoting
    const GeneralDAOVotingFactory = await ethers.getContractFactory("GeneralDAOVoting");

    // Attach to existing instances of GeneralDAOVoting
    const VotingContract = GeneralDAOVotingFactory.attach(VOTING_CONTRACT_ADDRESS);
    const MainDAOContract = GeneralDAOVotingFactory.attach(MAIN_DAO_VOTING_ADDRESS);

		console.log("Creating Voting Situation");

    // Creating voting situations for adding a new module and the module itself
    const daoRegistrySituation = buildVotingSituation("DAORegistry", `${DAO_REGISTRY_NAME}`);		
		const moduleVoteSituation = buildVotingSituation(`${MODULE_NAME}`, `${MODULE_NAME}`);

    // Encoding the data for proposals
    const addDRSituationCalldata = getEncodedData("GeneralDAOVoting", "createDAOVotingSituation", daoRegistrySituation);
    const addModuleVoteSituationCalldata = getEncodedData("GeneralDAOVoting", "createDAOVotingSituation", moduleVoteSituation);

		console.log("Creating Proposal for DAORegistry situation");

    // Creating voting proposals for the new voting situations
    await MainDAOContract.createProposal("General Update Vote", "Adding DAORegistry Situation", addDRSituationCalldata, {
        from: senderAddress,
    });
		console.log("Proposal Created");

		console.log(`Create Proposal for ${MODULE_NAME} situation`);

    await VotingContract.createProposal("General Update Vote", `Adding ${MODULE_NAME} Situation`, addModuleVoteSituationCalldata, {
        from: senderAddress,
    });
		console.log("Proposal Created");
}

// Call the main function to deploy voting proposals
main();
