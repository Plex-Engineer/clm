const addresses = {
  comptroller: "0x9514c07bC6e80B652e4264E64f589C59065C231f",
  priceOracle: "0xc7ec6De0a382aC45143fF6774ED3692419715C95",
  cRWADelegator: "0xf8892860437674690fC34746d0e93d881d5b96B4",
};
module.exports = async function () {
  const comptroller = await ethers.getContractAt(
    "Comptroller",
    addresses.comptroller
  );
//   await (await comptroller._setPriceOracle(addresses.priceOracle)).wait();
//   await (await comptroller._supportMarket(addresses.cRWADelegator)).wait();
  const tx = await (
    await comptroller._setCollateralFactor(
      addresses.cRWADelegator,
      ethers.utils.parseEther("0.95")
    )
  ).wait();
  console.log(tx)

};
