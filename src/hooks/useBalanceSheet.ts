import { useCalls } from "@usedapp/core";
import { Contract } from "ethers";
import { abi } from "constants/abi";
import { ethers } from "ethers";
import { CantoTestnet, ADDRESSES, TOKENS } from "cantoui";
import { _getAmountOut } from "utils/balanceSheetFunctions";

const formatUnits = ethers.utils.formatUnits;
export interface BalanceSheetPriceObject {
  cantoPrice: number;
  cantoNotePrice: number;
  ETHPrice: number;
  cantoETHPrice: number;
  ATOMPrice: number;
  cantoATOMPrice: number;
  USDCPrice: number;
  noteUSDCPrice: number;
  USDTPrice: number;
  noteUSDTPrice: number;
}

export function useBalanceSheet(chainId: string | undefined) {
  //manually get pair information
  const addresses =
    Number(chainId) == CantoTestnet.chainId
      ? ADDRESSES.testnet
      : ADDRESSES.cantoMainnet;
  const tokens =
    Number(chainId) == CantoTestnet.chainId
      ? TOKENS.cantoTestnet
      : TOKENS.cantoMainnet;

  //router contract
  const router = new Contract(addresses.PriceFeed, abi.priceOracle);

  //canto contract
  const calls = [
    {
      contract: router,
      method: "getReserves",
      args: [addresses.WCANTO, addresses.Note, false],
    },
    {
      contract: new Contract(addresses.CantoNoteLP, abi.Erc20),
      method: "totalSupply",
      args: [],
    },
    {
      contract: router,
      method: "getReserves",
      args: [addresses.WCANTO, addresses.ETH, false],
    },
    {
      contract: new Contract(addresses.CantoETHLP, abi.Erc20),
      method: "totalSupply",
      args: [],
    },
    {
      contract: router,
      method: "getReserves",
      args: [addresses.WCANTO, addresses.ATOM, false],
    },
    {
      contract: new Contract(addresses.CantoAtomLP, abi.Erc20),
      method: "totalSupply",
      args: [],
    },
    {
      contract: router,
      method: "getReserves",
      args: [addresses.Note, addresses.USDC, true],
    },
    {
      contract: new Contract(addresses.NoteUSDCLP, abi.Erc20),
      method: "totalSupply",
      args: [],
    },
    {
      contract: router,
      method: "getReserves",
      args: [addresses.Note, addresses.USDT, true],
    },
    {
      contract: new Contract(addresses.NoteUSDTLP, abi.Erc20),
      method: "totalSupply",
      args: [],
    },
  ];

  const results = useCalls(calls.flat()) ?? {};
  if (results?.[0] != undefined && !results?.[0].error) {
    //CANTONOTE
    const cantoSupply0 = formatUnits(
      results[0]?.value.reserveA,
      tokens.CANTO.decimals
    );
    const noteSupply0 = formatUnits(
      results[0]?.value.reserveB,
      tokens.NOTE.decimals
    );
    const totalLP0 = formatUnits(
      results[1]?.value[0],
      tokens.CantoNote.decimals
    );
    const cantoPrice = Number(noteSupply0) / Number(cantoSupply0);
    const cantoNotePrice =
      (Number(cantoSupply0) * cantoPrice + Number(noteSupply0)) /
      Number(totalLP0);

    //CANTOETH
    const cantoSupply1 = formatUnits(
      results[2]?.value.reserveA,
      tokens.CANTO.decimals
    );
    const ETHSupply1 = formatUnits(
      results[2]?.value.reserveB,
      tokens.ETH.decimals
    );
    const totalLP1 = formatUnits(
      results[3]?.value[0],
      tokens.CantoETH.decimals
    );
    const ETHPrice =
      (Number(cantoSupply1) / Number(ETHSupply1)) * Number(cantoPrice);
    const cantoETHPrice =
      (Number(cantoSupply1) * cantoPrice + Number(ETHSupply1) * ETHPrice) /
      Number(totalLP1);

    //CANTOATOM
    const cantoSupply2 = formatUnits(
      results[4]?.value.reserveA,
      tokens.CANTO.decimals
    );
    const ATOMSupply2 = formatUnits(
      results[4]?.value.reserveB,
      tokens.ATOM.decimals
    );
    const totalLP2 = formatUnits(
      results[5]?.value[0],
      tokens.CantoAtom.decimals
    );
    const ATOMPrice =
      (Number(cantoSupply2) / Number(ATOMSupply2)) * Number(cantoPrice);
    const cantoATOMPrice =
      (Number(cantoSupply2) * cantoPrice + Number(ATOMSupply2) * ATOMPrice) /
      Number(totalLP2);

    //NOTEUSDC
    const NoteSupply3 = formatUnits(
      results[6]?.value.reserveA,
      tokens.NOTE.decimals
    );
    const USDCSupply3 = formatUnits(
      results[6]?.value.reserveB,
      tokens.USDC.decimals
    );
    const totalLP3 = formatUnits(
      results[7]?.value[0],
      tokens.NoteUSDC.decimals
    );
    //how much you would get for 1 USDC
    const USDCPrice = _getAmountOut(
      1,
      Number(results[6]?.value.reserveA.toString()),
      Number(results[6]?.value.reserveB.toString())
    );
    const noteUSDCPrice =
      (Number(NoteSupply3) + Number(USDCSupply3) * USDCPrice) /
      Number(totalLP3);

    //NOTEUSDT
    const NoteSupply4 = formatUnits(
      results[8]?.value.reserveA,
      tokens.NOTE.decimals
    );
    const USDTSUpply4 = formatUnits(
      results[8]?.value.reserveB,
      tokens.USDT.decimals
    );
    const totalLP4 = formatUnits(
      results[9]?.value[0],
      tokens.NoteUSDT.decimals
    );

    //how much you would get for 1 USDT
    const USDTPrice = _getAmountOut(
      1,
      Number(results[8]?.value.reserveA.toString()),
      Number(results[8]?.value.reserveB.toString())
    );
    const noteUSDTPrice =
      (Number(NoteSupply4) + Number(USDTSUpply4) * USDTPrice) /
      Number(totalLP4);

    return {
      cantoPrice,
      cantoNotePrice,
      ETHPrice,
      cantoETHPrice,
      ATOMPrice,
      cantoATOMPrice,
      USDCPrice,
      noteUSDCPrice,
      USDTPrice,
      noteUSDTPrice,
    };
  }
  return undefined;
}
