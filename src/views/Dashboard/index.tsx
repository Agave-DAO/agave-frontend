import React from "react";
import { ethers } from "ethers";
import { DashboardLayout } from "./layout";
import { useUserDepositAssetBalancesDaiWei, useUserDepositAssetBalances } from "../../queries/userAssets";
import { DepositAsset } from "../Deposit";

function Dashboard() {
  const balances = useUserDepositAssetBalancesDaiWei();
  const depositedList: DepositAsset[] = React.useMemo(
    () => balances?.data?.filter(asset => !asset.balance.isZero()) ?? [],
    [balances]
  );

  const d = useUserDepositAssetBalances()
  if(d.data && d.data.length > 0) {
    console.log(d)
    console.log("@@", Number(ethers.utils.formatEther(d.data[0].balance)))
  }

  return (
    <DashboardLayout
      balance={undefined}
      borrowed={undefined}
      collateral={undefined}
      healthFactor={undefined}
      deposits={depositedList}
    />
  );
}

export default Dashboard;
