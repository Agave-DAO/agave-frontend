import { BigNumber } from "ethers";
import React, { useState } from "react";
import { WeiBox } from "../../components/Actions/WeiBox";
import * as Mui from "@material-ui/core";
import { Grid } from "@material-ui/core";

export interface StakingProps {}

export const Staking: React.FC<StakingProps> = (_props) => {
  const [amountToStake, setAmountToStake] = useState<BigNumber | undefined>(BigNumber.from(0));
  const agavePerMonth = 1.98;
  const cooldownPeriodSeconds = 60 * 60 * 24 * 10;
  const stakingAPY = 0.791;
  const currentMaxSlashing = 0.3;
  return (
    <Mui.Container>
      {/* <Mui.Paper> */}
      <Grid container spacing={3}>
        <Grid container item xs={12} alignContent="center" alignItems="center">
          <Mui.Card>Staking</Mui.Card>
        </Grid>
        <Grid container spacing={3}>
          <Grid
            container
            item
            xs={6}
            alignContent="center"
            alignItems="center"
            justify="center"
          >
            <Mui.Card>
              <h5>How much would you like to stake?</h5>
              <p>
                Staking in the Safety Module helps to secure Agave in exchange
                for protocol incentives
              </p>
              <WeiBox
                amount={amountToStake}
                setAmount={setAmountToStake}
                decimals={18}
              />
              <Mui.Button
                variant="outlined"
                disabled={
                  amountToStake === undefined ||
                  amountToStake.lte(BigNumber.from(0))
                }
              >
                STAKE
              </Mui.Button>
            </Mui.Card>
          </Grid>
          <Grid container item xs={6}>
            <Mui.Card>
              <Grid container item xs={12}>
                <Grid item xs={6}>
                  Agave Staked (?) 8.792 $87938.65
                  <Mui.Button>Activate Cooldown</Mui.Button>
                </Grid>
                <Grid item xs={6}>
                  Claimable Agave 0.23 $ 2347.31
                  <Mui.Button>Activate Cooldown</Mui.Button>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Mui.Paper>
                  Agave per month: {agavePerMonth} <br/>
                  Cooldown Period: {cooldownPeriodSeconds / (60 * 60 * 24)} days <br/>
                  Staking APY: {(stakingAPY * 100.0).toPrecision(3)}% <br/>
                  Current Max Slashing: {(currentMaxSlashing * 100.0).toPrecision(3)}% <br/>
                </Mui.Paper>
              </Grid>
            </Mui.Card>
          </Grid>
        </Grid>
      </Grid>
      {/* </Mui.Paper> */}
    </Mui.Container>
  );
};
