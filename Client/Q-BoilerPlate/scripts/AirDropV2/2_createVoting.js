const { getEncodedData } = require("@q-dev/gdk-sdk");
const { ethers } = require("hardhat");
require("dotenv").config();
const{ MODULE_NAME, MAIN_DAO_VOTING_ADDRESS, VOTING_CONTRACT_ADDRESS, TEN_PERCENTAGE, DAO_REGISTRY_NAME } = process.env;


function buildVotingSituation(name, target) {
    return {
        votingSituationName: name,
        votingValues: {
            votingPeriod: 300,
            votePeriod: 60,
            proposalExecutionPeriod: 1000,
            requireQuorum: TEN_PERCENTAGE,
            requiredMajority: TEN_PERCENTAGE,
            requireVetoQuorum: TEN_PERCENTAGE,
            votingType: 0,
            votingTarget: target,
            votingMinAmount: 1,
        },
    };
}


async function main (){
    const accounts = await ethers.getSigners();
    const senderAddress = accounts[0].address;

    // clear instance
    const VotingContract = GeneralDAOVotingFactory.attach(VOTING_CONTRACT_ADDRESS);
    const MainDAOContract = GeneralDAOVotingFactory.attach(MAIN_DAO_VOTING_ADDRESS);

    // voting situation
    console.log("Creating Voting Situation");
    // add a new module
    const daoRegistrySituation = buildVotingSituation("DAORegistry", `${DAO_REGISTRY_NAME}`);
    const moduleVoteSituation = buildVotingSituation(`${MODULE_NAME}`, `${MODULE_NAME}`);

    






}

main();