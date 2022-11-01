const { expect } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");
const {
  testAddresses,
} = require("../../../script/helpers/utils/testAddresses.js");

let dep;

let Comptroller;
let Router;
let Note;
let USDC;
let USDT;
let ATOM;
let ETH;
let WETH;
let cCanto;
let cUSDC;

describe("testing price oracle on CLM price oracle", async () => {
  before(async () => {
    [dep] = await ethers.getSigners();
    Comptroller = new ethers.Contract(
      (await deployments.get("Unitroller")).address,
      (await deployments.get("Comptroller")).abi,
      dep
    );
    Router = await ethers.getContract("BaseV1Router01");
    CLMPriceOracle = await ethers.getContractAt("CLMPriceOracle", "0xcf9A1B83eAF8E9333AEf2C69d5aA220FcAC60D6e")
    ETH = await ethers.getContractAt("ERC20", testAddresses.ETH);
    WETH = await ethers.getContract("WETH");

    USDC = await ethers.getContractAt("ERC20", testAddresses.USDC);
    USDT = await ethers.getContractAt("ERC20", testAddresses.USDT);
    cCanto = await ethers.getContract("CCanto");
    Note = await ethers.getContract("Note");
    cUSDC = await ethers.getContract("CUsdcDelegator");


  });
  it("set canto price oracle", async () => {
    const CLMPriceOracelFactory = await ethers.getContractFactory(
      "CLMPriceOracle"
    );
    const CLMPriceOracles = await CLMPriceOracelFactory.deploy(
      Comptroller.address,
      Router.address,
      USDC.address,
      USDT.address,
      Note.address,
      WETH.address,
      cCanto.address
    );
    await (await Comptroller._setPriceOracle(CLMPriceOracles.address)).wait();
    console.log(CLMPriceOracles.address)
    console.log(await CLMPriceOracles.getUnderlyingPrice(cUSDC.address))
  });
});
