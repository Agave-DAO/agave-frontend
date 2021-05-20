import { BigNumber } from "@ethersproject/bignumber";
import { StakedToken__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export interface StakingCooldownInfo {
  cooldownPeriodSeconds: BigNumber;
  unstakeWindowSeconds: BigNumber;
}

export const useStakingCooldown = buildQueryHookWhenParamsDefinedChainAddrs<
  StakingCooldownInfo,
  [_prefixStaking: "staking", _prefixRewards: "cooldown"],
  []
>(
  async params => {
    const contract = StakedToken__factory.connect(
      params.chainAddrs.staking,
      params.library.getSigner()
    );
    const [cooldownPeriodSeconds, unstakeWindowSeconds] = await Promise.all([
      contract.COOLDOWN_SECONDS(),
      contract.UNSTAKE_WINDOW(),
    ]);
    return { cooldownPeriodSeconds, unstakeWindowSeconds };
  },
  () => ["staking", "cooldown"],
  () => undefined
);
