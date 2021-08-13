import { BigNumber } from "@ethersproject/bignumber";
import { StakedToken__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export const useAmountStakedBy = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [
    _prefixStaking: "staking",
    _prefixRewards: "amountStaked",
    stakerAddress: string | undefined
  ],
  [stakerAddress: string]
>(
  async (params, stakerAddress) => {
    const contract = StakedToken__factory.connect(
      params.chainAddrs.staking,
      params.library
    );
    return await contract.balanceOf(stakerAddress);
  },
  stakerAddress => ["staking", "amountStaked", stakerAddress],
  () => undefined
);
