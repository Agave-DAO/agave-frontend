import React from "react";
import { DashboardLayout } from "./layout";
import { useUserDepositAssetBalancesDaiWei } from "../../queries/userAssets";
import { DepositAsset } from "../Deposit"

function Dashboard() {

  const balances = useUserDepositAssetBalancesDaiWei();
  const depositedList: DepositAsset[] = React.useMemo(
    () => balances?.data?.filter(asset => !asset.balance.isZero()) ?? [],
    [balances]
  );
  
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
