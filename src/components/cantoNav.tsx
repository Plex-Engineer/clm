/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEthers } from "@usedapp/core";
import { NavBar, useAlert } from "cantoui";
import {
  addNetwork,
  getAccountBalance,
  getChainIdandAccount,
} from "utils/addCantoToWallet";
import { useEffect } from "react";
import { useNetworkInfo } from "stores/networkInfo";
import logo from "../assets/logo.svg";

export const CantoNav = () => {
  const netWorkInfo = useNetworkInfo();
  const alert = useAlert();
  const { activateBrowserWallet, account } = useEthers();

  async function setChainInfo() {
    const [chainId, account] = await getChainIdandAccount();
    netWorkInfo.setChainId(chainId);
    netWorkInfo.setAccount(account);
    if (account != undefined) {
      netWorkInfo.setBalance(await getAccountBalance(account));
    }
  }

  useEffect(() => {
    if (!netWorkInfo.isConnected) {
      alert.show(
        "Failure",
        <p>
          this network is not supported on the lending market, please{" "}
          <a
            onClick={addNetwork}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            switch networks
          </a>
        </p>
      );
    } else {
      alert.close();
    }
  }, [netWorkInfo.isConnected]);

  useEffect(() => {
    setChainInfo();
  }, []);

  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });

    //@ts-ignore
    window.ethereum.on("networkChanged", () => {
      window.location.reload();
    });
  }

  const pageList = [
    {
      name: "bridge",
      link: "https://bridge.v1.canto.io",
    },
    {
      name: "convert coin",
      link: "https://convert.v1.canto.io",
    },
    {
      name: "staking",
      link: "https://staking.v1.canto.io",
    },
    {
      name: "lp interface",
      link: "https://lp.v1.canto.io",
    },
    {
      name: "lending",
      link: "https://lending.v1.canto.io",
    },
    {
      name: "governance",
      link: "https://governance.v1.canto.io",
    },
  ];

  return (
    <NavBar
      onClick={() => {
        activateBrowserWallet();
        addNetwork();
      }}
      chainId={Number(netWorkInfo.chainId)}
      account={netWorkInfo.account ?? ""}
      isConnected={!!account}
      balance={netWorkInfo.balance}
      currency={"CANTO"}
      logo={logo}
      currentPage="lending"
      pageList={pageList}
    />
  );
};
