import { ethers } from "ethers";
import { LMToken } from "hooks/interfaces";
import {
  BalanceSheetPriceObject,
  useBalanceSheet,
} from "hooks/useBalanceSheet";
import {
  BalanceSheetToken,
  useBalanceSheetData,
} from "hooks/useBalanceSheetData";
import { useTokens } from "hooks/useTokens";
import { useNetworkInfo } from "stores/networkInfo";
import { noteSymbol } from "utils";
import { getPriceFromName, truncateNumber } from "utils/balanceSheetFunctions";
import LendingTable from "../components/lending/lendingTable";

export const BalanceSheet = () => {
  const networkInfo = useNetworkInfo();
  const allData = useTokens(networkInfo.account, Number(networkInfo.chainId));
  const tokens = allData?.LMTokens;
  const priceObject = useBalanceSheet(networkInfo.chainId);
  const columns = ["ticker", "balance (supply + wallet)", "value"];

  const { assetTokens, debtTokens, totals } = useBalanceSheetData(
    tokens,
    priceObject
  );
  if (!tokens) {
    return <div></div>;
  }

  return (
    <div>
      <BalanceSheetTable
        name="assets"
        columns={columns}
        tokens={assetTokens}
        total={totals.totalAssets}
      />
      <BalanceSheetTable
        name="debt"
        columns={columns}
        tokens={debtTokens}
        total={totals.totalDebt}
      />
      <BalanceSheetTable
        name="total"
        columns={["", "", "value"]}
        tokens={[]}
        total={totals.totalAssets - totals.totalDebt}
      />
    </div>
  );
};

interface BalanceSheetRowProps {
  assetName: string;
  assetIcon?: string;
  quantity?: string;
  value: string;
}
const BalanceSheetRow = (props: BalanceSheetRowProps) => {
  return (
    <tr>
      <td>
        <img src={props.assetIcon} alt="" /> <p>{props.assetName}</p>
      </td>
      <td width={"33%"}>{props.quantity}</td>
      <td width={"33%"}>{noteSymbol + props.value}</td>
    </tr>
  );
};

interface BalanceTableProps {
  name: string;
  columns: string[];
  tokens: BalanceSheetToken[];
  total: number;
}
const BalanceSheetTable = (props: BalanceTableProps) => {
  return (
    <div style={{ color: "white" }}>
      {props.name}
      <LendingTable columns={props.columns} isLending>
        {props.tokens.map((token) => {
          return (
            <BalanceSheetRow
              key={token.symbol + props.name}
              assetName={token.symbol}
              assetIcon={token.icon}
              quantity={truncateNumber(token.balanceOf.toString())}
              value={truncateNumber(token.balanceOfNote.toString())}
            />
          );
        })}
        <BalanceSheetRow
          key={props.name}
          assetName={"total " + props.name}
          value={truncateNumber(props.total.toString())}
        />
      </LendingTable>
    </div>
  );
};
