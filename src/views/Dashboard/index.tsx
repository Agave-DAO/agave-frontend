import React from "react";
import { DashboardLayout } from "./layout";
import { useUserDepositAssetBalances } from "../../queries/userAssets";
import { BigNumber } from "ethers";

export interface AssetData {
  tokenAddress: string;
  symbol: string;
  balance: BigNumber;
}

export const Dashboard: React.FC<{}> = () => {
  const balances = useUserDepositAssetBalances();
  const depositedList: AssetData[] = React.useMemo(
    () => balances?.data?.filter(asset => !asset.balance.isZero()) ?? [],
    [balances]
  );
  
  return (
    <DashboardLayout
      borrowed={undefined}
      collateral={undefined}
      borrows={undefined}
      deposits={depositedList}
      healthFactor={undefined}
    />
  );
};
