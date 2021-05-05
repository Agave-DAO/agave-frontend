import React, { useState } from "react";
// import { WeiBox } from "../../components/Actions/WeiBox";
import { BigNumber } from "@ethersproject/bignumber";

export interface StakingLayoutProps {
  agavePerMonth: number;
  cooldownPeriodSeconds: number;
  stakingAPY: number;
}

export const StakingLayout: React.FC<StakingLayoutProps> = ({
  agavePerMonth,
  cooldownPeriodSeconds,
  stakingAPY,
}) => {
  const [amountToStake, setAmountToStake] = useState<BigNumber | undefined>(
    BigNumber.from(0)
  );
  return (
    // <Mui.Container>
    //   <Grid container spacing={3}>
    //     <Grid container item xs={12} alignContent="center" alignItems="center">
    //       <Mui.Card>Staking</Mui.Card>
    //     </Grid>
    //     <Grid container spacing={3}>
    //       <Grid
    //         container
    //         item
    //         xs={6}
    //         alignContent="center"
    //         alignItems="center"
    //         justify="center"
    //       >
    //         <Mui.Card>
    //           <h5>How much would you like to stake?</h5>
    //           <p>
    //             Staking in the Safety Module helps to secure Agave in exchange
    //             for protocol incentives
    //           </p>
    //           <WeiBox
    //             amount={amountToStake}
    //             setAmount={setAmountToStake}
    //             decimals={18}
    //           />
    //           <Mui.Button
    //             variant="outlined"
    //             disabled={
    //               amountToStake === undefined ||
    //               amountToStake.lte(BigNumber.from(0))
    //             }
    //           >
    //             STAKE
    //           </Mui.Button>
    //         </Mui.Card>
    //       </Grid>
    //       <Grid container item xs={6}>
    //         <Mui.Card>
    //           <Grid container item xs={12}>
    //             <Grid item xs={6}>
    //               Agave Staked (?) 8.792 $87938.65
    //               <Mui.Button>Activate Cooldown</Mui.Button>
    //             </Grid>
    //             <Grid item xs={6}>
    //               Claimable Agave 0.23 $ 2347.31
    //               <Mui.Button>Activate Cooldown</Mui.Button>
    //             </Grid>
    //           </Grid>
    //           <Grid item xs={12}>
    //             <Mui.Paper>
    //               Agave per month: {agavePerMonth} <br />
    //               Cooldown Period: {cooldownPeriodSeconds /
    //                 (60 * 60 * 24)} days <br />
    //               Staking APY: {(stakingAPY * 100.0).toPrecision(3)}% <br />
    //             </Mui.Paper>
    //           </Grid>
    //         </Mui.Card>
    //       </Grid>
    //     </Grid>
    //   </Grid>
    // </Mui.Container>
    <h1>Hi there</h1>
  );
};
