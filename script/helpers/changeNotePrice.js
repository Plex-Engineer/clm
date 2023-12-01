const { ethers, deployments } = require("hardhat");

const USDC_ADDRESS = "0xc51534568489f47949A828C8e3BF68463bdF3566"
const NOTE_ADDRESS = "0x03F734Bd9847575fDbE9bEaDDf9C166F880B5E5f"
const ROUTER_ADDRESS = "0x463e7d4DF8fE5fb42D024cb57c77b76e6e74417a"
async function main() {
    const [dep] = await ethers.getSigners();

    const deployer = dep.address;
    // const cNoteInterest = await ethers.getContractAt("NoteRateModel", "0x05506AB8a02168c17df7f66D9a61e7bAeb4F886a")
    // await (await cNoteInterest._setUpdateFrequency(10)).wait()


    const Note = await ethers.getContractAt("Note", NOTE_ADDRESS);
    const USDC = await ethers.getContractAt("ERC20", USDC_ADDRESS);
    const router = await ethers.getContractAt("BaseV1Router01", ROUTER_ADDRESS);

    await swapTokens(USDC, Note, router, deployer, true);

}

async function swapTokens(t1, t2, oracle, deployer, stable) {
  let t1BalanceBefore = await t1.balanceOf(deployer);
  let t2BalanceBefore = await t2.balanceOf(deployer);
  console.log("SWAP: ");
  await (
    await oracle.swapExactTokensForTokensSimple(
      ethers.utils.parseUnits("1000000", await t1.decimals()),
      ethers.utils.parseUnits("0", await t2.decimals()),
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
