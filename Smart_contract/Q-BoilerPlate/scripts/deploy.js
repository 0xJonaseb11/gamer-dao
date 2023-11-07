const main = async () => {
    const DAO = await hre.ethers.getContractFactory("DAO");
    const dao = await DAO.deploy();

    // awit dao.deployed();

    console.log("DAO contract deplpoyed to:", dao.address);
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error("Error deploying contract:",error);
        process.exit(1);
    }
}

runMain();

