const { ethers } = require("hardhat");
const { testAddresses } = require("../helpers/utils/testAddresses.js");

async function main() {
  const [dep] = await ethers.getSigners();
  const timelock = await ethers.getContract("Timelock");
  console.log(timelock.address)
  const treasury = await ethers.getContractAt(
    "TreasuryDelegate",
    testAddresses.TreasuryDelegator
  );
  const accountant = await ethers.getContractAt(
    "AccountantDelegate",
    testAddresses.AccountantDelegator
  );
  const governorBravo = await ethers.getContractAt(
    "GovernorBravoDelegate",
    testAddresses.GovernorBravoDelegator
  );
  const unitroller = await ethers.getContractAt(
    "Unitroller",
    testAddresses.Unitroller
  );
  const cNote = await ethers.getContract("CNoteDelegator");
  const cCanto = await ethers.getContract("CCanto");
  const cAtom = await ethers.getContract("CAtomDelegator");
  const cEth = await ethers.getContract("CETHDelegator");
  const cUsdc = await ethers.getContract("CUsdcDelegator");
  const cUsdt = await ethers.getContract("CUsdtDelegator");
  const cCantoNote = await ethers.getContract("CCantoNoteDelegator");
  const cCantoEth = await ethers.getContract("CCantoEthDelegator");
  const cCantoAtom = await ethers.getContract("CCantoAtomDelegator");
  const cNoteUsdt = await ethers.getContract("CNoteUsdtDelegator");
  const cNoteUsdc = await ethers.getContract("CNoteUsdcDelegator");

    const allContractsToSetAdmin = [
      treasury,
      accountant,
      governorBravo,
      unitroller,
      cNote,
      cCanto,
      cAtom,
      cEth,
      cUsdc,
      cUsdt,
      cCantoNote,
      cCantoEth,
      cCantoAtom,
      cNoteUsdt,
      cNoteUsdc,
    ];
    for (let contract of allContractsToSetAdmin) {
      await (await contract._setPendingAdmin(timelock.address)).wait();
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
