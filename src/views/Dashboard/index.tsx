import React from "react";
import { DashboardLayout } from "./layout";
import {
  useUserDepositAssetBalancesWithReserveInfo,
  useUserVariableDebtTokenBalances
} from "../../queries/userAssets";
import { BigNumber } from "ethers";
import { ReserveTokenDefinition } from "../../queries/allReserveTokens";

export interface AssetData {
  tokenAddress: string;
  symbol: string;
  backingReserve?: ReserveTokenDefinition | undefined;
  balance: BigNumber;
}

export const Dashboard: React.FC<{}> = () => {
  const borrows = useUserVariableDebtTokenBalances();
  const borrowedList: AssetData[] = React.useMemo(
    () => (borrows?.data?.filter(asset => !asset.balance.isZero()) ?? []),
    [borrows]
  );
  console.log('borrows', borrows)

  const balances = useUserDepositAssetBalancesWithReserveInfo();
  const depositedList: AssetData[] = React.useMemo(
    () => (balances?.data?.filter(asset => !asset.balance.isZero()) ?? []).map(a => ({ ...a, backingReserve: a.reserve })),
    [balances]
  );
 
  return (
    <DashboardLayout
      borrowed={undefined}
      collateral={undefined}
      borrows={borrowedList}
      deposits={depositedList}
      healthFactor={undefined}
    />
  );
};
