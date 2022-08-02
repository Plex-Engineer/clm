import { cTokensBase, mainnetBasecTokens } from "./lendingMarketTokens";
import { CantoTestnet, CantoMainnet } from "providers/index"
import { CTOKEN } from "./tokens";
import { ethers } from "ethers";
import { TOKENS } from "./tokens";

export async function addTokens(chainId: number | undefined) {
    if (!chainId || !(chainId == CantoMainnet.chainId || chainId == CantoTestnet.chainId)) {
        return;
    }
    const baseTokens : CTOKEN[] = chainId == CantoTestnet.chainId ? cTokensBase : mainnetBasecTokens
    try {
        baseTokens.forEach(async (token) => {
            if (token.underlying.name == "Canto") {
                return
            }
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            // @ts-ignore
            await ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20", // Initially only supports ERC20, but eventually more!
                    options: {
                        address: token.underlying.address, // The address that the token is at.
                        symbol: token.underlying.symbol.slice(0,11), // A ticker symbol or shorthand, up to 5 chars.
                        decimals: token.underlying.decimals, // The number of decimals in the token
                        image: token.underlying.icon, // A string url of the token logo
                    },
                },
            });
        });
    } catch (error) {
        console.log(error);
    }
    const WCANTO = chainId == CantoTestnet.chainId ? TOKENS.cantoTestnet.WCANTO : TOKENS.cantoMainnet.WCANTO;
    try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            // @ts-ignore
            await ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20", // Initially only supports ERC20, but eventually more!
                    options: {
                        address: WCANTO.address, // The address that the token is at.
                        symbol: WCANTO.symbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: WCANTO.decimals, // The number of decimals in the token
                        image: WCANTO.icon, // A string url of the token logo
                    },
                },
            });
    } catch (error) {
        console.log(error);
    }

}

export async function addCTokens(chainId: number | undefined) {
    if (!chainId || !(chainId == CantoMainnet.chainId || chainId == CantoTestnet.chainId)) {
        return;
    }
    const baseTokens : CTOKEN[] = chainId == CantoTestnet.chainId ? cTokensBase : mainnetBasecTokens
    try {
        baseTokens.forEach(async (token) => {
            // @ts-ignore
            await ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20", // Initially only supports ERC20, but eventually more!
                    options: {
                        address: token.address, // The address that the token is at.
                        symbol: token.symbol.slice(0,11), // A ticker symbol or shorthand, up to 5 chars.
                        decimals: token.decimals, // The number of decimals in the token
                        image: token.underlying.icon, // A string url of the token logo
                    },
                },
            });
        });
    } catch (error) {
        console.log(error);
    }
}

export function addNetwork() {
//@ts-ignore
        window.ethereum
            .request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: "0x" + CantoMainnet.chainId.toString(16),
                        chainName: "Canto",
                        nativeCurrency: {
                            name: "Canto Coin",
                            symbol: "CANTO",
                            decimals: 18,
                        },
                        rpcUrls: [CantoMainnet.rpcUrl],
                        blockExplorerUrls: [CantoMainnet.blockExplorerUrl],
                    },
                ],
            })
            .catch((error: any) => {
                console.log(error);
            });
}

export function getChainIdandAccount(): string[] | undefined[] {
    //@ts-ignore
    if (window.ethereum) {
      //@ts-ignore
      return [window.ethereum.networkVersion, window.ethereum.selectedAddress];
    }
    return [undefined, undefined];
  }
  export async function connect() {
      //@ts-ignore
      if (window.ethereum) {
        //@ts-ignore
        window.ethereum.request({method: "eth_requestAccounts"});
        addNetwork();
      }
    }
  
  export async function getAccountBalance(account: string | undefined) {
      //@ts-ignore
      if (window.ethereum) {
          //@ts-ignore
          let balance = await window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
          return ethers.utils.formatEther(balance);
      }
      return "0";
   
  }