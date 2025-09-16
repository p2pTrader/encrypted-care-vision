import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment of EncryptedCareVision...");

  // Get the contract factory
  const EncryptedCareVision = await ethers.getContractFactory("EncryptedCareVision");

  // Set emergency access address (can be the deployer or a specific emergency address)
  const emergencyAccess = process.env.EMERGENCY_ACCESS || (await ethers.getSigners())[0].address;

  console.log("Deploying EncryptedCareVision with emergency access:", emergencyAccess);

  // Deploy the contract
  const encryptedCareVision = await EncryptedCareVision.deploy(emergencyAccess);

  // Wait for deployment to complete
  await encryptedCareVision.waitForDeployment();

  const contractAddress = await encryptedCareVision.getAddress();

  console.log("EncryptedCareVision deployed to:", contractAddress);
  console.log("Emergency access address:", emergencyAccess);

  // Verify deployment by calling some view functions
  try {
    const patientCount = await encryptedCareVision.getPatientCount();
    const recordCount = await encryptedCareVision.getRecordCount();
    const planCount = await encryptedCareVision.getPlanCount();
    const doctorCount = await encryptedCareVision.getDoctorCount();

    console.log("Contract verification:");
    console.log("- Patient count:", patientCount.toString());
    console.log("- Record count:", recordCount.toString());
    console.log("- Plan count:", planCount.toString());
    console.log("- Doctor count:", doctorCount.toString());
  } catch (error) {
    console.log("Contract verification failed:", error);
  }

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    emergencyAccess,
    network: await ethers.provider.getNetwork(),
    deployer: (await ethers.getSigners())[0].address,
    timestamp: new Date().toISOString(),
  };

  console.log("\nDeployment completed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", deploymentInfo.network.name, "(", deploymentInfo.network.chainId, ")");
  console.log("Deployer:", deploymentInfo.deployer);
  console.log("Timestamp:", deploymentInfo.timestamp);

  // Instructions for next steps
  console.log("\nNext steps:");
  console.log("1. Update your .env file with the contract address:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("2. Verify the contract on Etherscan (if on a public network):");
  console.log(`   npx hardhat verify --network sepolia ${contractAddress} "${emergencyAccess}"`);
  console.log("3. Update your frontend configuration with the new contract address");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
