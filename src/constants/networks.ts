import { cTokensBase, mainnetBasecTokens } from "./lendingMarketTokens";
import addresses from "constants/addresses";


export const CantoMain = {
  name: "Canto Mainnet",
  symbol: "CANTO",
  chainId: 7700,
  addresses: addresses.cantoMainnet,
  tokens: mainnetBasecTokens,
  rpcUrl: "https://evm.plexnode.wtf",
  cosmosAPIEndpoint: "https://cosmos.plexnode.wtf/",
  isTestChain: false,
  blockExplorerUrl: "https://evm.explorer.canto.io/",
};

export const CantoTest = {
  name: "Canto Testnet",
  symbol: "CANTO",
  chainId: 740,
  addresses: addresses.testnet,
  tokens: cTokensBase,
  rpcUrl: "https://eth.plexnode.wtf",
  cosmosAPIEndpoint: "https://chain.plexnode.wtf/",
  isTestChain: true,
  blockExplorerUrl: "https://www.nothing.com",
};
