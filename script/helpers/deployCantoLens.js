const { ethers } = require("hardhat");

async function main() {
  const CantoLensFactory = await ethers.getContractFactory("CantoLens");
  const cantoLens = await CantoLensFactory.deploy();
  await cantoLens.deployed();
  console.log("CantoLens deployed to:", cantoLens.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
