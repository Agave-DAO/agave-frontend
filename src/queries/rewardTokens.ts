import { BigNumber } from "ethers";
import { BaseIncentivesController__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import {
  useUserDepositAssetBalances,
  useUserVariableDebtTokenBalances,
} from "./userAssets";

export const useUserRewards = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [_p1: "user", _p2: "asset"],
  []
>(
  async params => {
    const contract = BaseIncentivesController__factory.connect(
      params.chainAddrs.incentivesController,
      params.library
    );
    console.log(params.chainAddrs.incentivesController);
    const aTokens = await (
      await useUserDepositAssetBalances.fetchQueryDefined(params)
    ).map(tk => tk.tokenAddress);
    const variableDebtTokens = await (
      await useUserVariableDebtTokenBalances.fetchQueryDefined(params)
    ).map(tk => tk.tokenAddress);
    const queriedAssets = [...aTokens, ...variableDebtTokens];
    const rewards = await contract.getRewardsBalance(
      queriedAssets,
      params.account
    );
    return rewards;
  },
  () => ["user", "asset"],
  () => undefined,
  {
    cacheTime: 60 * 1000,
    staleTime: 30 * 1000,
  }
);
