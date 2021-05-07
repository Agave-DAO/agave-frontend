import React from "react";
// import { WeiBox } from "../../components/Actions/WeiBox";
import { BigNumber } from "@ethersproject/bignumber";
import Layout from "../../layout";

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
    <Layout>
      <Layout.Body>Hola amigos</Layout.Body>
    </Layout>
  );
};
