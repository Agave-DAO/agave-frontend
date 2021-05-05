import { BigNumber } from "ethers";
import React, { useState } from "react";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { getChainAddresses } from "../../utils/chainAddresses";
import { StakingLayout } from "./layout";

export interface StakingProps {}

export const Staking: React.FC<StakingProps> = (_props) => {
  // We use an accessible, const object because otherwise typescript loses useAppWeb3's type magic
  const w3 = useAppWeb3();
  if (w3.library == null) {
    return <>Staking requires access to Web3 via your wallet. Please connect it to continue.</>;
  }
  const chainId = getChainAddresses(w3.chainId);
  if (chainId == null) {
    return <>You are on an unsupported chain. How did you even do that?</>;
  }

  const agavePerMonth = 1.98;
  const cooldownPeriodSeconds = 60 * 60 * 24 * 10;
  const stakingAPY = 0.791;
  return StakingLayout({
    agavePerMonth,
    cooldownPeriodSeconds,
    stakingAPY,
  });
};
