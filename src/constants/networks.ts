import { CantoMain, CantoTest} from "providers/index";
import { cTokensBase, mainnetBasecTokens } from "./lendingMarketTokens";
import addresses from "constants/addresses"

export const networkProperties = [
    {
      name: "Canto Testnet",
      symbol: "CANTO",
      chainId : CantoTest.chainId,
      tokens : cTokensBase,
      addresses: addresses.testnet,
      chainInfo: CantoTest
    },
    {
      name: "Canto Mainnet",
      symbol: "CANTO",
      chainId: CantoMain.chainId,
      tokens: mainnetBasecTokens,
      addresses: addresses.cantoMainnet,
      chainInfo: CantoMain
    }
  ]