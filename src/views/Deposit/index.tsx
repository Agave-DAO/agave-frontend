import React from "react";
import { BigNumber, BigNumberish } from "ethers";
import { useUserDepositAssetBalancesDaiWei } from "../../queries/userAssets";
import { DepositLayout } from "./layout";

export interface DepositAsset {
  symbol: string;
  aSymbol: string;
  tokenAddress: string;
  aTokenAddress: string;
  balance: BigNumber;
  decimals: BigNumberish;
  daiWeiPricePer: BigNumber | null;
  daiWeiPriceTotal: BigNumber | null;
}

export const Deposit: React.FC<{}> = () => {
  const [activeValue, setActiveValue] =
    React.useState<"All" | "Stable Coins">("All");
  const balances = useUserDepositAssetBalancesDaiWei();
  const depositedList: DepositAsset[] = React.useMemo(
    () => balances?.data?.filter(asset => (BigNumber.isBigNumber(asset.balance) && !asset.balance.isZero())) ?? [],
    [balances]
  );
  return React.useMemo(
    () => (
      <DepositLayout
        activeValue={activeValue}
        setActiveValue={setActiveValue}
        depositedList={depositedList}
      />
    ),
    [activeValue, setActiveValue, depositedList]
  );
};
