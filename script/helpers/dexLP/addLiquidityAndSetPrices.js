const { formatUnits, parseUnits } = require("ethers/lib/utils");
const { ethers, deployments } = require("hardhat");
const { testAddresses } = require("../utils/testAddresses");

async function main() {
  const [dep] = await ethers.getSigners();
  const deployerAddress = dep.address;

  const Note = await ethers.getContract("Note");
  const USDC = await ethers.getContractAt("ERC20", testAddresses.USDC);
  const USDT = await ethers.getContractAt("ERC20", testAddresses.USDT);
  const ATOM = await ethers.getContractAt("ERC20", testAddresses.ATOM);
  const ETH = await ethers.getContractAt("ERC20", testAddresses.ETH);
  const WCANTO = await ethers.getContract("WETH");

  const tokens = [USDC, Note, USDT, ATOM, ETH, WCANTO];
  for (var token of tokens) {
    console.log(`${await token.name()}: ${token.address}`);
  }
  let cNote = await ethers.getContract("CNoteDelegator");
  let cCanto = await ethers.getContract("CCanto");
  let cAtom = await ethers.getContract("CAtomDelegator");
  let cEth = await ethers.getContract("CETHDelegator");
  let cUsdc = await ethers.getContract("CUsdcDelegator");
  let cUsdt = await ethers.getContract("CUsdtDelegator");

  const cTokens = [cNote, cCanto, cAtom, cEth, cUsdc, cUsdt];
  for (var cToken of cTokens) {
    console.log(`${await cToken.name()}: ${cToken.address}`);
  }
  //checks over to make sure all contracts were grabbed correctly

  const Unitroller = new ethers.Contract(
    (await deployments.get("Unitroller")).address,
    (await deployments.get("Comptroller")).abi,
    dep
  );
  const router = await ethers.getContract("BaseV1Router01");
  const BaseV1Factory = await ethers.getContract("BaseV1Factory");
  //   //All variables set
  await (await BaseV1Factory.setPeriodSize(0)).wait();

  //supply tokens in market
  await supplyToken(Unitroller, USDC, cUsdc, parseUnits("50000000", 6));
  await supplyToken(Unitroller, USDT, cUsdt, parseUnits("50000000", 6));

  await (await cNote.borrow(parseUnits("50000000", "18"))).wait();
  console.log("borrow complete");
  // Add liquidity
  await (
    await WCANTO.deposit({ value: ethers.utils.parseUnits("42000000", "18") })
  ).wait();
  await addLiquidity(Note, WCANTO, router, deployerAddress, false, "10000000", "20000000");
  await addLiquidity(ETH, WCANTO, router, deployerAddress,false, "2500", "10000000");
  await addLiquidity(WCANTO, ATOM, router, deployerAddress, false, "10000000", "500000");
  await addLiquidity(Note, USDC, router, deployerAddress, true, "15000000", "15000000");
  await addLiquidity(Note, USDT, router, deployerAddress, true, "15000000", "15000000");
  await ((await BaseV1Factory.setPeriodSize(0)).wait());
  for (let i = 0; i < 15; i++) {
    await swapTokens(Note, WCANTO, router, deployerAddress, false, "1");
    await swapTokens(ETH, WCANTO, router, deployerAddress, false, "0.01");
    await swapTokens(ATOM, WCANTO, router, deployerAddress, false, "0.1");
    await swapTokens(USDC, Note, router, deployerAddress, true, "1");
    await swapTokens(USDT, Note, router, deployerAddress, true, "1");
  }
}
async function supplyToken(unitroller, token, cToken, amount) {
  //use as collateral
  await (await unitroller.enterMarkets([cToken.address])).wait();
  //approve spend
  await (await token.approve(cToken.address, amount)).wait();
  //supply to market
  await (await cToken.mint(amount)).wait();
}
async function addLiquidity(
  t1,
  t2,
  router,
  deployer,
  stable,
  amount1,
  amount2
) {
  console.log("ADD LIQUIDITY:");
  await (
    await t1.approve(
      router.address,
      ethers.utils.parseUnits(amount1, await t1.decimals())
    )
  ).wait();
  await (
    await t2.approve(
      router.address,
      ethers.utils.parseUnits(amount2, await t2.decimals())
    )
  ).wait();

  let t1BalanceBefore = await t1.balanceOf(deployer);
  let t2BalanceBefore = await t2.balanceOf(deployer);
  await (
    await router.addLiquidity(
      t1.address,
      t2.address,
      stable,
      ethers.utils.parseUnits(amount1, await t1.decimals()),
      ethers.utils.parseUnits(amount2, await t2.decimals()),
      0,
      0,
      deployer,
      ethers.BigNumber.from("9999999999999999999999999999999")
    )
  ).wait();
  let t1BalanceAfter = await t1.balanceOf(deployer);
  let t2BalanceAfter = await t2.balanceOf(deployer);
  console.log(t1BalanceBefore.toString() + "----->", t1BalanceAfter.toString());
  console.log(t2BalanceBefore.toString() + "----->", t2BalanceAfter.toString());
}
async function swapTokens(t1, t2, router, deployer, stable, amount) {
  await (
    await t1.approve(router.address, "100000000000000000000000000")
  ).wait();
  await (
    await t2.approve(router.address, "100000000000000000000000000")
  ).wait();
  let t1BalanceBefore = await t1.balanceOf(deployer);
  let t2BalanceBefore = await t2.balanceOf(deployer);
  console.log("SWAP: ");
  await (
    await router.swapExactTokensForTokensSimple(
      ethers.utils.parseUnits(amount, await t1.decimals()),
      ethers.utils.parseUnits("0", 1),
      t1.address,
      t2.address,
      stable,
      deployer,
      ethers.BigNumber.from("9999999999999999999999999999999")
    )
  ).wait();
  let t1BalanceAfter = await t1.balanceOf(deployer);
  let t2BalanceAfter = await t2.balanceOf(deployer);
  console.log(t1BalanceBefore.toString() + "----->", t1BalanceAfter.toString());
  console.log(t2BalanceBefore.toString() + "----->", t2BalanceAfter.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
