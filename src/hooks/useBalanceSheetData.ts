import { getPriceFromName } from "utils/balanceSheetFunctions";
import { LMToken } from "./interfaces";
import { BalanceSheetPriceObject } from "./useBalanceSheet";

export interface BalanceSheetToken {
  icon: string;
  symbol: string;
  balanceOf: number;
  balanceOfNote: number;
}
interface Totals {
  totalAssets: number;
  totalDebt: number;
}
export function useBalanceSheetData(
  tokens: LMToken[] | undefined,
  priceObject: BalanceSheetPriceObject | undefined
): {
  assetTokens: BalanceSheetToken[];
  debtTokens: BalanceSheetToken[];
  totals: Totals;
} {
  if (!tokens) {
    return {
      assetTokens: [],
      debtTokens: [],
      totals: { totalAssets: 0, totalDebt: 0 },
    };
  }
  let totalAssets = 0;
  let totalDebt = 0;
  const assetTokens: BalanceSheetToken[] = [];
  const debtTokens: BalanceSheetToken[] = [];

  tokens?.map((token) => {
    if (Number(token.balanceOf) == 0 && Number(token.balanceOfC) == 0) {
      return;
    }
    const price = getPriceFromName(token.data.underlying.symbol, priceObject);
    const balanceOf = Number(token.supplyBalance) + Number(token.balanceOf);
    const balanceOfNote = balanceOf * price;
    totalAssets += balanceOfNote;
    assetTokens.push({
      icon: token.data.underlying.icon,
      symbol: token.data.underlying.symbol,
      balanceOf,
      balanceOfNote,
    });
  });
  tokens?.map((token) => {
    if (Number(token.borrowBalance) == 0) {
      return;
    }
    const price = getPriceFromName(token.data.underlying.symbol, priceObject);
    const balanceOf = Number(token.borrowBalance);
    const balanceOfNote = balanceOf * price;
    totalDebt += balanceOfNote;
    debtTokens.push({
      icon: token.data.underlying.icon,
      symbol: token.data.underlying.symbol,
      balanceOf,
      balanceOfNote,
    });
  });
  const totals = {
    totalAssets,
    totalDebt,
  };
  return {
    assetTokens: assetTokens,
    debtTokens: debtTokens,
    totals: totals,
  };
}
