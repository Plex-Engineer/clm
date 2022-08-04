import { cTokensBase, mainnetBasecTokens } from "./lendingMarketTokens";
import { CantoTestnet, CantoMainnet } from "providers/index"
import { CTOKEN, CTOKENS } from "./tokens";
import { ethers } from "ethers";
import { TOKENS } from "./tokens";

export async function addTokens(chainId: number | undefined) {
    if (!chainId || !(chainId == CantoMainnet.chainId || chainId == CantoTestnet.chainId)) {
        return;
    }
    const tokens = chainId == CantoTestnet.chainId ? TOKENS.cantoTestnet : TOKENS.cantoMainnet;
    for (const [name, tokenObj] of Object.entries(tokens)) {
        try {
            if (tokenObj.name != "Canto") {
            //@ts-ignore
            ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20", // Initially only supports ERC20, but eventually more!
                    options: {
                        address: tokenObj.address, // The address that the token is at.
                        symbol: tokenObj.symbol.slice(0,11), // A ticker symbol or shorthand, up to 5 chars.
                        decimals: tokenObj.decimals, // The number of decimals in the token
                        image: tokenObj.icon, // A string url of the token logo
                    },
                }
            })
        }
        } catch (error) {
            // console.log(error)
        }
    }
}

export async function addCTokens(chainId: number | undefined) {
    if (!chainId || !(chainId == CantoMainnet.chainId || chainId == CantoTestnet.chainId)) {
        return;
    }
    const cTokens = chainId == CantoTestnet.chainId ? CTOKENS.cantoTestnet : CTOKENS.cantoMainnet;

    for (const [name, tokenObj] of Object.entries(cTokens)) {
        try {
            if (tokenObj.name != "Canto") {
            //@ts-ignore
            ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20", // Initially only supports ERC20, but eventually more!
                    options: {
                        address: tokenObj.address, // The address that the token is at.
                        symbol: tokenObj.symbol.slice(0,11), // A ticker symbol or shorthand, up to 5 chars.
                        decimals: tokenObj.decimals, // The number of decimals in the token
                        image: tokenObj.underlying.icon, // A string url of the token logo
                    },
                }
            })
        }
        } catch (error) {
            // console.log(error)
        }
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
                // console.log(error);
            });
}

export function getChainIdandAccount(): string[] | undefined[] {
    //@ts-ignore
    if (window.ethereum) {
        console.log("window ethereum was detected")
      //@ts-ignore
      return [window.ethereum.networkVersion, window.ethereum.selectedAddress];
    }
    console.log("window ethereum not detected")
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