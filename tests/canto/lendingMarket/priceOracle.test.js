const { formatUnits } = require("@ethersproject/units");
const { expect } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");
const {
  testAddresses,
} = require("../../../script/helpers/utils/testAddresses.js");
const { swapTokens, delay } = require("./utils.js");

let dep;

let Comptroller;
let Router;
let Note;
let USDC;
let USDT;
let ETH;
let WETH;
let cCanto;
let cUSDC;
let cETH;

describe("testing price oracle on CLM price oracle", async () => {
  before(async () => {
    [dep] = await ethers.getSigners();
    Comptroller = new ethers.Contract(
      (await deployments.get("Unitroller")).address,
      (await deployments.get("Comptroller")).abi,
      dep
    );
    Router = await ethers.getContract("BaseV1Router01");
    CLMPriceOracle = await ethers.getContractAt(
      "CLMPriceOracle",
      "0x6eF2D560C4f05AeA5Eb968b12214CDB368c531D0"
    );
    ETH = await ethers.getContractAt("ERC20", testAddresses.ETH);
    WETH = await ethers.getContract("WETH");
    USDC = await ethers.getContractAt("ERC20", testAddresses.USDC);
    USDT = await ethers.getContractAt("ERC20", testAddresses.USDT);
    cCanto = await ethers.getContract("CCanto");
    Note = await ethers.getContract("Note");
    cUSDC = await ethers.getContract("CUsdcDelegator");
    cETH = await ethers.getContract("CETHDelegator");
  });
  it("testing price of ERC20 token", async () => {
    const [cantoReserve, ETHReserve] = await Router.getReserves(WETH.address, ETH.address, false);
    await swapTokens(WETH, ETH, Router, dep, false, "500")
    console.log(cantoReserve, ETHReserve)
    console.log(formatUnits(await CLMPriceOracle.getUnderlyingPrice(cETH.address)).toString())
    console.log(formatUnits(await CLMPriceOracle.getUnderlyingPrice(cCanto.address)).toString())

});
});
