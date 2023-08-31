// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const { ethers } = require("hardhat");
const fs = require("fs");



async function main() {
  const deployerAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const [deployer] = await ethers.getSigners(deployerAddress);

  const Certificate_Verify_Dapp = await ethers.getContractFactory("Certificate_Verify");
  const certificateVerifyDapp = await Certificate_Verify_Dapp.connect(deployer).deploy();
  await certificateVerifyDapp.deployed();
  let certificateVerifyDappAddress = certificateVerifyDapp.address;

  console.log("Certificate Verify Dapp deployed to:", certificateVerifyDappAddress);
  console.log("Transaction hash:", certificateVerifyDapp.deployTransaction.hash);

  // BSCScan linkini oluştur
  const bscscanBaseUrl = "https://bscscan.com/";
  const bscscanLink = bscscanBaseUrl + "address/" + certificateVerifyDappAddress;
  console.log("BSCScan link:", bscscanLink);
  
  let config = "export const Certificate Verify Dapp Address = " + certificateVerifyDappAddress;

  console.log("Certificate Verify Dapp Address = " + certificateVerifyDappAddress);

  let data = JSON.stringify(config);

  fs.writeFileSync("config.js", data);

  const network = await ethers.getDefaultProvider().getNetwork();
  console.log("Network name=", network.name);
  console.log("Network chain id=", network.chainId);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
