import { HelmetProvider } from "react-helmet-async";
import { DAppProvider, Config, Mainnet as ETHMain } from "@usedapp/core";
import React from "react";
import TokenProvider from "./activeTokenContext";
import OverallStatsProvider from "./overallStats";
import TransactionStatusProvider from "./transactionContext";
import { Chain } from "@usedapp/core";

interface IProviderProps {
  children: React.ReactNode;
}

export const getAddressLink = (explorerUrl: string) => (address: string) => `${explorerUrl}/address/${address}`

export const getTransactionLink = (explorerUrl: string) => (txnId: string) => `${explorerUrl}/tx/${txnId}`

export const CantoTest: Chain = {
  chainId: 771,
  chainName: 'Canto Test',
  rpcUrl : "http://165.227.98.94:8545",
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: '0xaEc0D885BBFa4B339eFCd490c50053738A872fd0',
  multicall2Address: '0xF4583A82384330fBFd0ABbF98189425c8471059e',
  blockExplorerUrl: "https://www.nothing.com",
  getExplorerAddressLink: getAddressLink("kovanEtherscanUrl"),
  getExplorerTransactionLink: getTransactionLink("kovanEtherscanUrl"),
}

export const CantoMain: Chain = {
  chainId: 740,
  chainName: 'Canto Main',
  rpcUrl : "https://eth.plexnode.wtf",
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: '0x121817438FC9b31ed4D6C4ED22eCde15af261f75',
  multicall2Address: '0xd546F2aaB14eA4d4Dc083795b3e94D0C471A272f',
  blockExplorerUrl: "https://www.nothing.com",
  getExplorerAddressLink: getAddressLink("kovanEtherscanUrl"),
  getExplorerTransactionLink: getTransactionLink("kovanEtherscanUrl"),
}



const config: Config = {
  networks : [CantoTest, CantoMain],
  readOnlyUrls: {
    [CantoTest.chainId]: "http://165.227.98.94:8545",
    [CantoMain.chainId] : "https://eth.plexnode.wtf"
  },
  noMetamaskDeactivate : true,
};

//All the providers are wrapped in this provider function
const Provider = ({ children }: IProviderProps) => {
  return (
    <DAppProvider config={config}>
      <HelmetProvider>
        <TokenProvider>
          <OverallStatsProvider>
            <TransactionStatusProvider>{children}</TransactionStatusProvider>
          </OverallStatsProvider>
        </TokenProvider>
      </HelmetProvider>
    </DAppProvider>
  );
};

export default Provider;
