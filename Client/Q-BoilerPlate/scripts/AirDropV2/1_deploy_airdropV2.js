import { ethers } from "hardhat";

async function main() {
    console.log("Deploying AirDropV2");

    const AirDropV2 = await ethers.getContractFactory("AirDropV2");
    const airdropV2 = await AirDropV2.deploy();

    await airdropV2.awiatForDeployment();

    // Get address
    const airdropAddress = await airdropV2.getAddress();
    

}

main();