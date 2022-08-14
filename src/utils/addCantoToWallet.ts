import { CantoMainnet } from "cantoui";
import { ethers } from "ethers";

export function addNetwork() {
    console.log(window)
    //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    window?.ethereum
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
}

export async function getChainIdandAccount(): Promise<string[] | undefined[]> {
  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    await window.ethereum.request({method: 'eth_requestAccounts'});
    //@ts-ignore
    return [window.ethereum.networkVersion, window.ethereum.selectedAddress];
  }
  return [undefined, undefined];
}
export async function connect() {
  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    window.ethereum.request({ method: "eth_requestAccounts" });
    addNetwork();
  }
}

export async function getAccountBalance(account: string | undefined) {
  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    let balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [account, "latest"],
    });
    return ethers.utils.formatEther(balance);
  }
  return "0";
}