import React from "react";
import { BigNumber, BigNumberish } from "ethers";
import { useUserStableAndVariableDebtTokenBalancesDaiWei } from "../../queries/userAssets";
import { BorrowLayout } from "./layout";

export interface BorrowAsset {
  symbol: string;
  tokenAddress: string;
  balance: BigNumber;
  decimals: BigNumberish;
  daiWeiPricePer: BigNumber | null;
  daiWeiPriceTotal: BigNumber | null;
  borrowMode: number
}

export const Borrow: React.FC<{}> = () => {
  const [activeValue, setActiveValue] =
    React.useState<"All" | "Stable Coins">("All");
  const balances = useUserStableAndVariableDebtTokenBalancesDaiWei();
  const borrowedList: BorrowAsset[] = React.useMemo(
    () => balances?.data?.filter(asset => !asset.balance.isZero()) ?? [],
    [balances]
  );
  return React.useMemo(
    () => (
      <BorrowLayout
        activeValue={activeValue}
        setActiveValue={setActiveValue}
        borrowedList={borrowedList}
      />
    ),
    [activeValue, setActiveValue, borrowedList]
  );
};
