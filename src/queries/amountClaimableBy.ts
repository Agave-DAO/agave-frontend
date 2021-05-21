import { BigNumber } from "@ethersproject/bignumber";
import { ErrorCode } from "@ethersproject/logger";
import { StakedToken__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export const useAmountClaimableBy = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [
    _prefixStaking: "staking",
    _prefixRewards: "claimable",
    stakerAddress: string | undefined
  ],
  [stakerAddress: string]
>(
  async (params, stakerAddress) => {
    const contract = StakedToken__factory.connect(
      params.chainAddrs.staking,
      params.library.getSigner()
    );
    let balance;
    try {
      balance = await contract.getTotalRewardsBalance(stakerAddress);
    } catch (e) {
      if (e.code === ErrorCode.CALL_EXCEPTION) {
        return BigNumber.from(0);
      }
      throw e;
    }
    return balance;
  },
  stakerAddress => ["staking", "claimable", stakerAddress],
  () => undefined
);
