import { BigNumber } from "@ethersproject/bignumber";
import { Erc20abi__factory, StakedToken__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export const useAmountAvailableToStake =
  buildQueryHookWhenParamsDefinedChainAddrs<
    BigNumber,
    [
      _prefixStaking: "staking",
      _prefixRewards: "availableToStake",
      stakerAddress: string | undefined
    ],
    [stakerAddress: string]
  >(
    async (params, stakerAddress) => {
      const contract = StakedToken__factory.connect(
        params.chainAddrs.staking,
        params.library
      );
      return await contract
        .STAKED_TOKEN()
        .then(stakedToken =>
          Erc20abi__factory.connect(
            stakedToken,
            params.library
          ).balanceOf(stakerAddress)
        );
    },
    stakerAddress => ["staking", "availableToStake", stakerAddress],
    () => undefined
  );
