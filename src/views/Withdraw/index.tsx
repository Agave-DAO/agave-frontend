import React from "react";
import { BigNumber } from "ethers";
import { useUserDepositAssetBalancesDaiWei } from "../../queries/userAssets";
import { WithdrawLayout } from "./layout";

export { WithdrawBanner } from "./layout";

export interface WithdrawAsset {
  symbol: string;
  aSymbol: string;
  tokenAddress: string;
  aTokenAddress: string;
  balance: BigNumber;
  daiWeiPricePer: BigNumber | null;
  daiWeiPriceTotal: BigNumber | null;
}

export const Withdraw: React.FC = () => {
  const [activeValue, setActiveValue] =
    React.useState<"All" | "Stable Coins">("All");
  const balances = useUserDepositAssetBalancesDaiWei();
  const depositedList: WithdrawAsset[] = React.useMemo(
    () => balances?.data?.filter(asset => !asset.balance.isZero()) ?? [],
    [balances]
  );
  return React.useMemo(
    () => (
      <WithdrawLayout
        activeValue={activeValue}
        setActiveValue={setActiveValue}
        depositedList={depositedList}
      />
    ),
    [activeValue, setActiveValue, depositedList]
  );
}
