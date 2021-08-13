import { BigNumber } from "@ethersproject/bignumber";
import {
  StakedToken__factory,
  AaveDistributionManager__factory,
} from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { constants } from "ethers";

export const useStakingPerSecondPerAgaveYield =
  buildQueryHookWhenParamsDefinedChainAddrs<
    BigNumber,
    [_prefixStaking: "staking", _prefixRewards: "perSecondPerAgaveYield"],
    []
  >(
    async params => {
      const contract = StakedToken__factory.connect(
        params.chainAddrs.staking,
        params.library
      );
      const totalStaked = await contract.totalSupply();
      const emissionManager = AaveDistributionManager__factory.connect(
        params.chainAddrs.staking,
        params.library
      );
      const stakedTokenAssetInfo = await emissionManager.assets(
        params.chainAddrs.staking
      );
      const emissionPerSecond = stakedTokenAssetInfo.emissionPerSecond;
      if (totalStaked.gt(0)) {
        return emissionPerSecond.mul(constants.WeiPerEther).div(totalStaked);
      } else {
        return emissionPerSecond;
      }
    },
    () => ["staking", "perSecondPerAgaveYield"],
    () => undefined
  );
