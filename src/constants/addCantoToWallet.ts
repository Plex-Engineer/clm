import { cTokensBase, mainnetBasecTokens } from "./lendingMarketTokens";
import { CantoTest, CantoMain } from "providers/index"
import { CTOKEN } from "./tokens";

export async function addTokens(chainId: number | undefined) {
    if (!chainId || !(chainId == CantoMain.chainId || chainId == CantoTest.chainId)) {
        return;
    }
    const baseTokens : CTOKEN[] = chainId == CantoTest.chainId ? cTokensBase : mainnetBasecTokens
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
}

export async function addCTokens(chainId: number | undefined) {
    if (!chainId || !(chainId == CantoMain.chainId || chainId == CantoTest.chainId)) {
        return;
    }
    const baseTokens : CTOKEN[] = chainId == CantoTest.chainId ? cTokensBase : mainnetBasecTokens
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
                        chainId: "0x" + CantoMain.chainId.toString(16),
                        chainName: "Canto",
                        nativeCurrency: {
                            name: "Canto Coin",
                            symbol: "CANTO",
                            decimals: 18,
                        },
                        rpcUrls: [CantoMain.rpcUrl],
                        blockExplorerUrls: [CantoMain.blockExplorerUrl],
                    },
                ],
            })
            .catch((error: any) => {
                console.log(error);
            });
}

export function checkNetworkVersion() : boolean {
    //@ts-ignore
    if (window.ethereum) {
        //@ts-ignore
        const currentChain = window.ethereum.networkVersion;
        if (!(currentChain == CantoMain.chainId || currentChain == CantoTest.chainId)) {
          return false;
        } else {
          return true;
        }
      } 
    return false;
}