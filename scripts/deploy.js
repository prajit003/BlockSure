// Deployment script for BlockSureWarranty on Ethereum Sepolia Testnet
const { ethers } = require("hardhat");

async function main() {
    console.log("==================================================================");
    console.log("  BlockSure Electronic Warranty - Ethereum Sepolia Testnet Deploy");
    console.log("==================================================================");

    const network = await ethers.provider.getNetwork();
    console.log(`Target Network Name: ${network.name} (Chain ID: ${network.chainId})`);

    const [deployer, manufacturer, customer, serviceCenter] = await ethers.getSigners();
    console.log("Deployer Wallet Address:", deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Deployer Sepolia ETH Balance:", ethers.formatEther(balance), "Sepolia ETH");

    if (balance === 0n) {
        console.warn("⚠️ Warning: Deployer balance is 0 Sepolia ETH. Please get free Sepolia ETH from https://sepoliafaucet.com");
    }

    console.log("\nDeploying BlockSureWarranty contract...");
    const BlockSure = await ethers.getContractFactory("BlockSureWarranty");
    const blockSure = await BlockSure.deploy();
    await blockSure.waitForDeployment();

    const contractAddress = await blockSure.getAddress();
    console.log("\n✅ BlockSureWarranty successfully deployed to Sepolia Testnet!");
    console.log("📍 Contract Address:", contractAddress);
    console.log("🔗 Sepolia Etherscan Link: https://sepolia.etherscan.io/address/" + contractAddress);

    // Initial setup
    if (manufacturer) {
        console.log("\nAuthorizing Initial Manufacturer:", manufacturer.address);
        await blockSure.addManufacturer(manufacturer.address);
    }

    if (serviceCenter) {
        console.log("Authorizing Initial Service Center:", serviceCenter.address);
        await blockSure.approveServiceCenter(serviceCenter.address);
    }

    console.log("\n==================================================================");
    console.log("  Deployment Complete! Paste Contract Address in frontend/app.js");
    console.log("==================================================================");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Sepolia Deployment error:", error);
        process.exit(1);
    });
