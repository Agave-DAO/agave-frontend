import React, { useState } from 'react';
import { BigNumber } from 'ethers';
import { useUserDepositAssetBalances } from  '../../queries/userAssets'
import {DepositLayout} from './layout';

export interface DepositAsset {
  symbol: string,
  tokenAddress: string,
  balance: BigNumber
}

function Deposit() {
  const [activeValue, setActiveValue] = useState<"All" | "Stable Coins">('All');
  const balances = useUserDepositAssetBalances()
  const depositedList: DepositAsset[] = []
  balances?.data?.map(value => {
    if (value.balance.isZero()) {
      depositedList.push(value)
    }
  })
  
  console.log(">>>>", depositedList)

  const handleSetActiveValue = (value: ("All" | "Stable Coins")) => {
    setActiveValue(value)
  }
  

  return (
    <div>
      <DepositLayout
        activeValue={activeValue}
        setActiveValue={(value) => {handleSetActiveValue(value)}}
        depositedList={depositedList}
      />
    </div>
  );
}

export default Deposit;
