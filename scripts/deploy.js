// Deployment script for BlockSureWarranty
const { ethers } = require("hardhat");

async function main() {
    console.log("=================================================");
    console.log("  BlockSure Electronic Warranty - Contract Deployment");
    console.log("=================================================");

    const [deployer, manufacturer, customer, serviceCenter] = await ethers.getSigners();

    console.log("Deploying contract with account:", deployer.address);

    const BlockSure = await ethers.getContractFactory("BlockSureWarranty");
    const blockSure = await BlockSure.deploy();
    await blockSure.waitForDeployment();

    const contractAddress = await blockSure.getAddress();
    console.log("BlockSureWarranty deployed successfully at:", contractAddress);

    // Initial setups for demonstration
    if (manufacturer) {
        console.log("Adding Manufacturer:", manufacturer.address);
        await blockSure.addManufacturer(manufacturer.address);
    }

    if (serviceCenter) {
        console.log("Adding Authorized Service Center:", serviceCenter.address);
        await blockSure.connect(manufacturer || deployer).addServiceCenter(serviceCenter.address);
    }

    console.log("\nSetup complete! You can paste contract address in frontend/app.js");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment error:", error);
        process.exit(1);
    });
