import React from "react";
import { BigNumber, ethers } from "ethers";
import { DashboardLayout } from "./layout";
import { useUserDepositAssetBalancesDaiWei, useUserDepositAssetBalances } from "../../queries/userAssets";
import { DepositAsset } from "../Deposit";

export interface AssetData {
  tokenAddress: string;
  symbol: string;
  balance: BigNumber;
}

function Dashboard() {
  const balances = useUserDepositAssetBalances();
  const depositedList: AssetData[] = React.useMemo(
    () => balances?.data?.filter(asset => !asset.balance.isZero()) ?? [],
    [balances]
  );
  
  const balance = React.useMemo(() => {
    return depositedList.reduce(
      (memo, next) =>
        memo +
        (Number(ethers.utils.formatEther(next.balance ?? 0)) ?? 0),
      0
    );
  }, [depositedList]);

  console.log('>>>', balance)
  // const b = useUserDepositAssetBalancesDaiWei()
  // console.log(b)

  
  return (
    <DashboardLayout
      balance={balance}
      borrowed={undefined}
      collateral={undefined}
      healthFactor={undefined}
      deposits={depositedList}
    />
  );
}

export default Dashboard;
