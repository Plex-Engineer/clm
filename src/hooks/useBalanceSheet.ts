import { useCalls } from "@usedapp/core";
import { Contract } from "ethers";
import { abi } from "constants/abi";
import { ethers } from "ethers";
import { CantoTestnet, ADDRESSES, TOKENS } from "cantoui";
import { _getAmountOut } from "utils/balanceSheetFunctions";
import { TokenPriceObject } from "../pages/balanceSheet/tokenPrices";

const formatUnits = ethers.utils.formatUnits;

export interface BalanceSheetPriceObject {
  tokenSymbol: string;
  tokenAddress: string;
  priceInNote: number;
}
export interface LPPriceObject {
  LPTokenSymbol: string;
  LPAddress: string;
  priceInNote: number;
  token1: {
    tokenSymbol: string;
    tokenAddress: string;
    tokensPerLP: number;
  };
  token2: {
    tokenSymbol: string;
    tokenAddress: string;
    tokensPerLP: number;
  };
}

export function useBalanceSheet(
  chainId: string | undefined,
  tokenPrices: TokenPriceObject[]
): {
  priceObject: BalanceSheetPriceObject[] | undefined;
  LPObject: LPPriceObject[] | undefined;
} {
  console.log(tokenPrices);
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
    //initialize LPPriceObject
    const LPPriceObject: LPPriceObject[] = [];
    const BalanceSheetPrice: BalanceSheetPriceObject[] = [];

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

    const tokensPerLP0 = {
      token1: Number(cantoSupply0) / Number(totalLP0),
      token2: Number(noteSupply0) / Number(totalLP0),
    };
    LPPriceObject.push({
      LPTokenSymbol: tokens.CantoNote.symbol,
      LPAddress: tokens.CantoNote.address,
      priceInNote: cantoNotePrice,
      token1: {
        tokenAddress: tokens.CANTO.address,
        tokenSymbol: tokens.CANTO.symbol,
        tokensPerLP: tokensPerLP0.token1,
      },
      token2: {
        tokenAddress: tokens.NOTE.address,
        tokenSymbol: tokens.NOTE.symbol,
        tokensPerLP: tokensPerLP0.token2,
      },
    });
    BalanceSheetPrice.push(
      {
        tokenSymbol: tokens.CANTO.symbol,
        tokenAddress: tokens.CANTO.address,
        priceInNote: cantoPrice,
      },
      {
        tokenAddress: tokens.NOTE.address,
        tokenSymbol: tokens.NOTE.symbol,
        priceInNote: 1,
      },
      {
        tokenAddress: tokens.CantoNote.address,
        tokenSymbol: tokens.CantoNote.symbol,
        priceInNote: cantoNotePrice,
      }
    );

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

    const tokensPerLP1 = {
      token1: Number(cantoSupply1) / Number(totalLP1),
      token2: Number(ETHSupply1) / Number(totalLP1),
    };

    LPPriceObject.push({
      LPTokenSymbol: tokens.CantoETH.symbol,
      LPAddress: tokens.CantoETH.address,
      priceInNote: cantoETHPrice,
      token1: {
        tokenAddress: tokens.CANTO.address,
        tokenSymbol: tokens.CANTO.symbol,
        tokensPerLP: tokensPerLP1.token1,
      },
      token2: {
        tokenAddress: tokens.ETH.address,
        tokenSymbol: tokens.ETH.symbol,
        tokensPerLP: tokensPerLP1.token2,
      },
    });
    BalanceSheetPrice.push(
      {
        tokenSymbol: tokens.ETH.symbol,
        tokenAddress: tokens.ETH.address,
        priceInNote: ETHPrice,
      },
      {
        tokenAddress: tokens.CantoETH.address,
        tokenSymbol: tokens.CantoETH.symbol,
        priceInNote: cantoETHPrice,
      }
    );

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

    const tokensPerLP2 = {
      token1: Number(cantoSupply2) / Number(totalLP2),
      token2: Number(ATOMSupply2) / Number(totalLP2),
    };

    LPPriceObject.push({
      LPTokenSymbol: tokens.CantoAtom.symbol,
      LPAddress: tokens.CantoAtom.address,
      priceInNote: cantoATOMPrice,
      token1: {
        tokenAddress: tokens.CANTO.address,
        tokenSymbol: tokens.CANTO.symbol,
        tokensPerLP: tokensPerLP2.token1,
      },
      token2: {
        tokenAddress: tokens.ATOM.address,
        tokenSymbol: tokens.ATOM.symbol,
        tokensPerLP: tokensPerLP2.token2,
      },
    });
    BalanceSheetPrice.push(
      {
        tokenSymbol: tokens.ATOM.symbol,
        tokenAddress: tokens.ATOM.address,
        priceInNote: ATOMPrice,
      },
      {
        tokenAddress: tokens.CantoAtom.address,
        tokenSymbol: tokens.CantoAtom.symbol,
        priceInNote: cantoATOMPrice,
      }
    );

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

    const tokensPerLP3 = {
      token1: Number(NoteSupply3) / Number(totalLP3),
      token2: Number(USDCSupply3) / Number(totalLP3),
    };

    LPPriceObject.push({
      LPTokenSymbol: tokens.NoteUSDC.symbol,
      LPAddress: tokens.NoteUSDC.address,
      priceInNote: noteUSDCPrice,
      token1: {
        tokenAddress: tokens.NOTE.address,
        tokenSymbol: tokens.NOTE.symbol,
        tokensPerLP: tokensPerLP3.token1,
      },
      token2: {
        tokenAddress: tokens.USDC.address,
        tokenSymbol: tokens.USDC.symbol,
        tokensPerLP: tokensPerLP3.token2,
      },
    });
    BalanceSheetPrice.push(
      {
        tokenSymbol: tokens.USDC.symbol,
        tokenAddress: tokens.USDC.address,
        priceInNote: USDCPrice,
      },
      {
        tokenAddress: tokens.NoteUSDC.address,
        tokenSymbol: tokens.NoteUSDC.symbol,
        priceInNote: noteUSDCPrice,
      }
    );

    //NOTEUSDT
    const NoteSupply4 = formatUnits(
      results[8]?.value.reserveA,
      tokens.NOTE.decimals
    );
    const USDTSupply4 = formatUnits(
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
      (Number(NoteSupply4) + Number(USDTSupply4) * USDTPrice) /
      Number(totalLP4);

    const tokensPerLP4 = {
      token1: Number(NoteSupply4) / Number(totalLP4),
      token2: Number(USDTSupply4) / Number(totalLP4),
    };

    LPPriceObject.push({
      LPTokenSymbol: tokens.NoteUSDT.symbol,
      LPAddress: tokens.NoteUSDT.address,
      priceInNote: noteUSDTPrice,
      token1: {
        tokenAddress: tokens.NOTE.address,
        tokenSymbol: tokens.NOTE.symbol,
        tokensPerLP: tokensPerLP4.token1,
      },
      token2: {
        tokenAddress: tokens.USDT.address,
        tokenSymbol: tokens.USDT.symbol,
        tokensPerLP: tokensPerLP4.token2,
      },
    });
    BalanceSheetPrice.push(
      {
        tokenSymbol: tokens.USDT.symbol,
        tokenAddress: tokens.USDT.address,
        priceInNote: USDTPrice,
      },
      {
        tokenAddress: tokens.NoteUSDT.address,
        tokenSymbol: tokens.NoteUSDT.symbol,
        priceInNote: noteUSDTPrice,
      }
    );

    return {
      priceObject: BalanceSheetPrice,
      LPObject: LPPriceObject,
    };
  }
  return { priceObject: undefined, LPObject: undefined };
}
