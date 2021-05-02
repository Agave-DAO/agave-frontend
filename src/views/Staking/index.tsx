import { BigNumber } from "ethers";
import React, { useState } from "react";
import { WeiBox } from "../../components/Actions/WeiBox";

export interface StakingProps {}

export const Staking: React.FC<StakingProps> = (_props) => {
  const [weiAmount, setWeiAmount] = useState<BigNumber | undefined>(BigNumber.from(10));
  return (
    <>
      <div style={{backgroundColor: "white"}}>
        Current value: {weiAmount?.toString() ?? "<invalid>"} wei
        <WeiBox amount={weiAmount} setAmount={setWeiAmount} decimals={18}/>
      </div>
    </>
  );
};
