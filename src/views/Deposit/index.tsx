import React, { useState } from "react";
import { BigNumber } from "ethers";
import {
  useUserDepositAssetBalances,
  useUserDepositAssetBalancesDaiWei,
} from "../../queries/userAssets";
import { DepositLayout } from "./layout";

export interface DepositAsset {
  symbol: string;
  aSymbol: string;
  tokenAddress: string;
  aTokenAddress: string;
  balance: BigNumber;
  daiWeiPricePer: BigNumber | null;
  daiWeiPriceTotal: BigNumber | null;
}

function Deposit() {
  const [activeValue, setActiveValue] = useState<"All" | "Stable Coins">("All");
  const balances = useUserDepositAssetBalancesDaiWei();
  const depositedList: DepositAsset[] = [];
  balances?.data?.map(value => {
    if (!value.balance.isZero()) {
      depositedList.push(value);
    }
  });

  const handleSetActiveValue = (value: "All" | "Stable Coins") => {
    setActiveValue(value);
  };

  return (
    <div>
      <DepositLayout
        activeValue={activeValue}
        setActiveValue={value => {
          handleSetActiveValue(value);
        }}
        depositedList={depositedList}
      />
    </div>
  );
}

export default Deposit;
