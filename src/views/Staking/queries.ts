import { useQuery } from "react-query";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import { ErrorCode } from "@ethersproject/logger";
import {
  Erc20abi__factory,
  StakedToken__factory,
  AaveDistributionManager__factory,
} from "../../../contracts";
import { getChainAddresses } from "../../../utils/chainAddresses";
import {
  Account,
  buildQueryHook,
  buildQueryHookWhenParamsDefinedChainAddrs,
} from "../../../utils/queryBuilder";
import { constants } from "ethers";

// interface ContractQueryHookParams<TKey extends readonly unknown[]> extends QueryHookParams<TKey> {

// }

// function buildContractQueryHook<TData, TKey extends readonly unknown[], TParams extends unknown[]>(
//   invoke: (args: Readonly<QueryHookParams<TKey>>, ...params: TParams) => Promise<TData | undefined>,
//   buildKey: (...params: TParams) => TKey,
//   buildInitialData?: (() => TData | undefined) | undefined,
// ): (...params: TParams) => QueryHookResult<TData, TKey> {
// }

export const useTotalRewardsBalance = buildQueryHook<
  BigNumber,
  ["staking", "rewards", Account | undefined],
  [stakerAddress: Account | undefined]
>(
  async ({ chainId, library, key: [_staking, _rewards, stakerAddress] }) => {
    if (!stakerAddress) {
      return undefined;
    }
    const chainAddresses = getChainAddresses(chainId);
    if (!chainAddresses) {
      return undefined;
    }
    const contract = StakedToken__factory.connect(
      chainAddresses.staking,
      library.getSigner()
    );
    let balance;
    try {
      balance = await contract.getTotalRewardsBalance(stakerAddress);
    } catch (e) {
      if (e.code == ErrorCode.CALL_EXCEPTION) {
        return BigNumber.from(0);
      }
      throw e;
    }
    return balance;
  },
  (addr) => ["staking", "rewards", addr],
  () => constants.Zero
);

export const useStakingEvents = buildQueryHook<
  BigNumber,
  [
    _prefixStaking: "staking",
    _prefixRewards: "events",
    stakerAddress: Account | undefined
  ],
  [stakerAddress: Account | undefined]
>(
  async ({ chainId, library }, stakerAddress) => {
    if (!stakerAddress) {
      return undefined;
    }
    const chainAddresses = getChainAddresses(chainId);
    if (!chainAddresses) {
      return undefined;
    }
    const contract = StakedToken__factory.connect(
      chainAddresses.staking,
      library.getSigner()
    );
    let balance;
    try {
      balance = await contract.stakersCooldowns(stakerAddress);
    } catch (e) {
      if (e.code == ErrorCode.CALL_EXCEPTION) {
        return BigNumber.from(0);
      }
      throw e;
    }
    return balance;
  },
  (stakerAddress) => ["staking", "events", stakerAddress],
  () => constants.Zero
);

export const useStakingCooldown = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [_prefixStaking: "staking", _prefixRewards: "cooldown"],
  []
>(
  async (params) => {
    const contract = StakedToken__factory.connect(
      params.chainAddrs.staking,
      params.library.getSigner()
    );
    return await contract.COOLDOWN_SECONDS();
  },
  () => ["staking", "cooldown"],
  () => constants.Zero
);

export const useTotalStakedForAllUsers = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [_prefixStaking: "staking", _prefixRewards: "totalSupply"],
  []
>(
  async (params) => {
    const contract = StakedToken__factory.connect(
      params.chainAddrs.staking,
      params.library.getSigner()
    );
    let balance;
    try {
      balance = await contract.totalSupply();
    } catch (e) {
      if (e.code == ErrorCode.CALL_EXCEPTION) {
        return BigNumber.from(0);
      }
      throw e;
    }
    return balance;
  },
  () => ["staking", "totalSupply"],
  () => undefined
);

export const useAmountStakedBy = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [
    _prefixStaking: "staking",
    _prefixRewards: "amountStaked",
    stakerAddress: string
  ],
  [stakerAddress: string]
>(
  async (params, stakerAddress) => {
    const contract = StakedToken__factory.connect(
      params.chainAddrs.staking,
      params.library.getSigner()
    );
    return await contract.balanceOf(stakerAddress);
  },
  (stakerAddress) => ["staking", "amountStaked", stakerAddress],
  () => undefined
);

export const useAmountClaimableBy = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [
    _prefixStaking: "staking",
    _prefixRewards: "claimable",
    stakerAddress: string
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
      balance = await contract.stakerRewardsToClaim(stakerAddress);
    } catch (e) {
      if (e.code == ErrorCode.CALL_EXCEPTION) {
        return BigNumber.from(0);
      }
      throw e;
    }
    return balance;
  },
  (stakerAddress) => ["staking", "claimable", stakerAddress],
  () => undefined
);

export const useAmountAvailableToStake = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [
    _prefixStaking: "staking",
    _prefixRewards: "availableToStake",
    stakerAddress: string
  ],
  [stakerAddress: string]
>(
  async (params, stakerAddress) => {
    const contract = StakedToken__factory.connect(
      params.chainAddrs.staking,
      params.library.getSigner()
    );
    return await contract
      .STAKED_TOKEN()
      .then((stakedToken) =>
        Erc20abi__factory.connect(
          stakedToken,
          params.library.getSigner()
        ).balanceOf(stakerAddress)
      );
  },
  (stakerAddress) => ["staking", "availableToStake", stakerAddress],
  () => undefined
);

export const useStakingPerSecondYield = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [
    _prefixStaking: "staking",
    _prefixRewards: "perSecondYield",
    stakedAmount: BigNumber
  ],
  [stakedAmount: BigNumber]
>(
  async (params, stakedAmount) => {
    const contract = StakedToken__factory.connect(
      params.chainAddrs.staking,
      params.library.getSigner()
    );
    const [
      stakedTokenAddress,
      emissionManagerAddress,
      totalStaked,
    ] = await Promise.all([
      contract.STAKED_TOKEN(),
      contract.EMISSION_MANAGER(),
      contract.totalSupply(),
    ]);
    const emissionManager = AaveDistributionManager__factory.connect(
      emissionManagerAddress,
      params.library.getSigner()
    );
    const stakedTokenAssetInfo = await emissionManager.assets(
      stakedTokenAddress
    );
    const emissionPerSecond = stakedTokenAssetInfo.emissionPerSecond;
    return emissionPerSecond.mul(stakedAmount).div(totalStaked);
  },
  (stakedAmount) => ["staking", "perSecondYield", stakedAmount],
  () => undefined
);
