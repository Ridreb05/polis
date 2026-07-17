const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Deploys the Polis governance contract and writes the deployed address plus
 * the ABI to a file the frontend can consume.
 */
async function main() {
  console.log("→ Deploying Polis governance contract...");

  const [deployer] = await ethers.getSigners();
  console.log("  Steward (deployer):", deployer.address);

  const Polis = await ethers.getContractFactory("Polis");
  const polis = await Polis.deploy();
  await polis.waitForDeployment();

  const address = await polis.getAddress();
  console.log("✓ Polis deployed at:", address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("  Deployer balance:", ethers.formatEther(balance), "AIA");

  // Persist the deployment so the client can pick it up.
  const artifact = await hre.artifacts.readArtifact("Polis");
  const out = {
    address,
    network: hre.network.name,
    abi: artifact.abi,
    deployedAt: new Date().toISOString(),
  };
  const outPath = path.join(__dirname, "..", "deployments.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log("  Deployment details written to", outPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("✗ Deployment failed:", error);
    process.exit(1);
  });
