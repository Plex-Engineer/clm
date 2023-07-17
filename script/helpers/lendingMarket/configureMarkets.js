const canto = require("../../../config/index.js");
async function main() {
  const [dep] = await ethers.getSigners();

  const comptroller = new ethers.Contract(
    (await deployments.get("Unitroller")).address,
    (await deployments.get("Comptroller")).abi,
    dep
  );
  const Cantomarkets = require("../../../config/markets.js");
  const markets = Cantomarkets.canto;

  // retrieve market parameters
  let cNote = await ethers.getContract("CNoteDelegator");
  let cCanto = await ethers.getContract("CCanto");
  let cAtom = await ethers.getContract("CAtomDelegator");
  let cEth = await ethers.getContract("CETHDelegator");
  let cUsdc = await ethers.getContract("CUsdcDelegator");
  let cUsdt = await ethers.getContract("CUsdtDelegator");
  let cCantoNote = await ethers.getContract("CCantoNoteDelegator");
  let cCantoEth = await ethers.getContract("CCantoEthDelegator");
  let cCantoAtom = await ethers.getContract("CCantoAtomDelegator");
  let cNoteUsdt = await ethers.getContract("CNoteUsdtDelegator");
  let cNoteUsdc = await ethers.getContract("CNoteUsdcDelegator");

  async function configureMarket(
    comptroller,
    cTokenAddress,
    collateralFactor,
    compSupplySpeed,
    compBorrowSpeed,
    borrowCap
  ) {
    await (await comptroller._supportMarket(cTokenAddress)).wait();
    await (
      await comptroller._setCollateralFactor(cTokenAddress, collateralFactor)
    ).wait(); // set the collateral factor for cToken
    await (
      await comptroller._setCompSpeeds(
        [cTokenAddress],
        [compSupplySpeed],
        [compBorrowSpeed]
      )
    ).wait();
    await (
      await comptroller._setMarketBorrowCaps([cTokenAddress], [borrowCap])
    ).wait(); //set the BorrowCap For this market
  }

  await configureMarket(
    comptroller,
    cNote.address,
    markets.CNote.CollateralFactor,
    markets.CNote.compSupplySpeed,
    markets.CNote.compBorrowSpeed,
    markets.CNote.borrowCap
  );
  console.log("CNote configured");
  await configureMarket(
    comptroller,
    cCanto.address,
    markets.CCanto.CollateralFactor,
    markets.CCanto.compSupplySpeed,
    markets.CCanto.compBorrowSpeed,
    markets.CCanto.borrowCap
  );
  console.log("CCanto configured");
  await configureMarket(
    comptroller,
    cAtom.address,
    markets.CAtom.CollateralFactor,
    markets.CAtom.compSupplySpeed,
    markets.CAtom.compBorrowSpeed,
    markets.CAtom.borrowCap
  );
  console.log("CAtom configured");
  await configureMarket(
    comptroller,
    cEth.address,
    markets.CEth.CollateralFactor,
    markets.CEth.compSupplySpeed,
    markets.CEth.compBorrowSpeed,
    markets.CEth.borrowCap
  );
  console.log("CEth configured");
  await configureMarket(
    comptroller,
    cUsdc.address,
    markets.CUsdc.CollateralFactor,
    markets.CUsdc.compSupplySpeed,
    markets.CUsdc.compBorrowSpeed,
    markets.CUsdc.borrowCap
  );
  console.log("CUsdc configured");
  await configureMarket(
    comptroller,
    cUsdt.address,
    markets.CUsdt.CollateralFactor,
    markets.CUsdt.compSupplySpeed,
    markets.CUsdt.compBorrowSpeed,
    markets.CUsdt.borrowCap
  );
  console.log("CUsdt configured");
  await configureMarket(
    comptroller,
    cCantoNote.address,
    markets.CCantoNote.CollateralFactor,
    markets.CCantoNote.compSupplySpeed,
    markets.CCantoNote.compBorrowSpeed,
    markets.CCantoNote.borrowCap
  );
  console.log("CCantoNote configured");
  await configureMarket(
    comptroller,
    cCantoEth.address,
    markets.CCantoEth.CollateralFactor,
    markets.CCantoEth.compSupplySpeed,
    markets.CCantoEth.compBorrowSpeed,
    markets.CCantoEth.borrowCap
  );
  console.log("CCantoEth configured");
  await configureMarket(
    comptroller,
    cCantoAtom.address,
    markets.CCantoAtom.CollateralFactor,
    markets.CCantoAtom.compSupplySpeed,
    markets.CCantoAtom.compBorrowSpeed,
    markets.CCantoAtom.borrowCap
  );
  console.log("CCantoAtom configured");
  await configureMarket(
    comptroller,
    cNoteUsdc.address,
    markets.CNoteUsdc.CollateralFactor,
    markets.CNoteUsdc.compSupplySpeed,
    markets.CNoteUsdc.compBorrowSpeed,
    markets.CNoteUsdc.borrowCap
  );
  console.log("CNoteUsdc configured");
  await configureMarket(
    comptroller,
    cNoteUsdt.address,
    markets.CNoteUsdt.CollateralFactor,
    markets.CNoteUsdt.compSupplySpeed,
    markets.CNoteUsdt.compBorrowSpeed,
    markets.CNoteUsdt.borrowCap
  );
  console.log("CNoteUsdt configured");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
