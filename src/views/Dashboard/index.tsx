import React from "react";
import { DashboardLayout } from "./layout";
import { useUserDepositAssetBalances, useUserDepositAssetBalancesDaiWei } from "../../queries/userAssets";
import { BigNumber, ethers } from "ethers";

export interface AssetData {
  tokenAddress: string;
  symbol: string;
  balance: BigNumber;
}

export const Dashboard: React.FC<{}> = () => {
  const balancesDaiWei = useUserDepositAssetBalancesDaiWei();
  const balances = useUserDepositAssetBalances();
  const depositedList: AssetData[] = React.useMemo(
    () => balances?.data?.filter(asset => !asset.balance.isZero()) ?? [],
    [balances]
  );
  
  const balance = React.useMemo(() => {
    return balancesDaiWei.data?.reduce(
      (memo, next) =>
        memo +
        (Number(ethers.utils.formatEther(next.daiWeiPriceTotal ?? 0)) ?? 0),
      0
    );
  }, [balancesDaiWei]);
  
  return (
    <DashboardLayout
      balance={balance}
      borrowed={undefined}
      collateral={undefined}
      borrows={undefined}
      deposits={depositedList}
      healthFactor={undefined}
    />
  );
};
