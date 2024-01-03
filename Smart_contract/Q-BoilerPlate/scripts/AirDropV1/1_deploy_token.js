const { ethers, upgrades } = require("hardhat");
Web3 = require('web3');


async function main() {
    
    //Metadata
    const name = "Meta DAO";
    const symbol = "Meta";
    const decimals = 18; // or any other value you want
    const contractURI = "";
    const resource = "QRC20_RESOURCE";
    const totalSupplyCap = Web3.utils.toWei('1000000000', 'ether');

    console.log("Deploying QRC20")
    const QRC20 = await ethers.getContractFactory("QRC20");
    const qrc = await upgrades.deployProxy(QRC20, [name,symbol,decimals,contractURI,resource,totalSupplyCap], {initializer:"initialize", kind: "transparent"});

    await qrc.waitForDeployment();
    const qrc20Address = await qrc.getAddress();
    console.log("QRC20 deployed to:", qrc20Address);

  } 

  main();