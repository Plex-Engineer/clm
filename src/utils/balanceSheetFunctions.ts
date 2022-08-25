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

export function _get_y(x0: number, xy: number, y: number) {
  for (let i = 0; i < 255; i++) {
    const y_prev = y;
    const k = _f(x0, y);
    if (k < xy) {
      const dy = ((xy - k) * 1e18) / _d(x0, y);
      y = y + dy;
    } else {
      const dy = ((k - xy) * 1e18) / _d(x0, y);
      y = y - dy;
    }
    if (y > y_prev) {
      if (y - y_prev <= 1) {
        return y;
      }
    } else {
      if (y_prev - y <= 1) {
        return y;
      }
    }
  }
  return y;
}
function _f(x0: number, y: number) {
  return (
    (x0 * ((((y * y) / 1e18) * y) / 1e18)) / 1e18 +
    (((((x0 * x0) / 1e18) * x0) / 1e18) * y) / 1e18
  );
}
function _d(x0: number, y: number) {
  return (3 * x0 * ((y * y) / 1e18)) / 1e18 + (((x0 * x0) / 1e18) * x0) / 1e18;
}
function _k(x: number, y: number) {
  const _x = (x * 1e18) / 1e18;
  const _y = (y * 1e18) / 1e6;
  const _a = (_x * _y) / 1e18;
  const _b = (_x * _x) / 1e18 + (_y * _y) / 1e18;
  return (_a * _b) / 1e18; // x3y+y3x >= k
}

export function _getAmountOut(
  amountIn: number,
  _reserve0: number,
  _reserve1: number
) {
  const xy = _k(_reserve0, _reserve1);
  _reserve0 = (_reserve0 * 1e18) / 1e18;
  _reserve1 = (_reserve1 * 1e18) / 1e6;
  const reserveA = _reserve1;
  const reserveB = _reserve0;
  amountIn = (amountIn * 1e18) / 1e6;
  const y = reserveB - _get_y(amountIn + reserveA, xy, reserveB);
  return (y * 1e6) / 1e18;
}
