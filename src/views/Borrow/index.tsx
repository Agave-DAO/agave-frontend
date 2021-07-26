import React from "react";
import { BigNumber } from "ethers";
import { useUserVariableDebtTokenBalancesDaiWei } from "../../queries/userAssets";
import { BorrowLayout } from "./layout";

export interface BorrowAsset {
  symbol: string;
  tokenAddress: string;
  balance: BigNumber;
  daiWeiPricePer: BigNumber | null;
  daiWeiPriceTotal: BigNumber | null;
}

export const Borrow: React.FC<{}> = () => {
  const [activeValue, setActiveValue] =
    React.useState<"All" | "Stable Coins">("All");
  const balances = useUserVariableDebtTokenBalancesDaiWei();
  console.log(balances);
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
