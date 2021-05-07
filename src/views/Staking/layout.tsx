import React from "react";
// import { WeiBox } from "../../components/Actions/WeiBox";

export interface StakingLayoutProps {
  agavePerMonth: number;
  cooldownPeriodSeconds: number;
  stakingAPY: number;
}

export const StakingLayout: React.FC<StakingLayoutProps> = ({
  agavePerMonth: _agavePerMonth,
  cooldownPeriodSeconds: _cooldownPeriodSeconds,
  stakingAPY: _stakingAPY,
}) => {
  return (
    <h1>Hi there</h1>
  );
};
