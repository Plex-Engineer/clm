import { BalanceSheetPriceObject } from "hooks/useBalanceSheet";

export function getPriceFromName(
  assetName: string,
  priceObject: BalanceSheetPriceObject | undefined
) {
  if (!priceObject) {
    return 0;
  }
  if (assetName == "CANTO") {
    return priceObject.cantoPrice;
  }
  if (assetName == "ETH") {
    return priceObject.ETHPrice;
  }
  if (assetName == "USDC") {
    return priceObject.USDCPrice;
  }
  if (assetName == "ATOM") {
    return priceObject.ATOMPrice;
  }
  if (assetName == "USDT") {
    return priceObject.USDTPrice;
  }
  if (assetName == "CantoAtomLP") {
    return priceObject.cantoATOMPrice;
  }
  if (assetName == "CantoETHLP") {
    return priceObject.cantoETHPrice;
  }
  if (assetName == "CantoNoteLP") {
    return priceObject.cantoNotePrice;
  }
  if (assetName == "NoteUSDCLP") {
    return priceObject.noteUSDCPrice;
  }
  if (assetName == "NoteUSDTLP") {
    return priceObject.noteUSDTPrice;
  }
  return 1;
}

export function truncateNumber(value: string, decimals?: number) {
  const decimalLocation = value.indexOf(".");
  if (Number(value) == 0) {
    return "0";
  }
  if (decimalLocation == -1) {
    return value;
  }
  if (!decimals) {
    if (Number(value) > 1) {
      return value.slice(0, decimalLocation + 3);
    }
    return value.slice(0, findFirstNonZeroAfter(value, decimalLocation) + 3);
  }
  return value.slice(0, decimalLocation + decimals);
}
function findFirstNonZeroAfter(value: string, after: number) {
  for (let i = after + 1; i < value.length; i++) {
    if (value[i] != "0") {
      return i - 1;
    }
  }
  return value.length - 1;
}
