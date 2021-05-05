import { useQuery } from "react-query";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from "@ethersproject/bignumber";
import { ErrorCode } from "@ethersproject/logger";
import { Erc20abi__factory, StakedToken__factory } from "../../../contracts";
import { getChainAddresses } from "../../../utils/chainAddresses";
import { ChainId, ContractAddress, Account, buildQueryHook } from "./queryBuilder";
import { constants } from "ethers";

export interface UseTotalRewardsDto {
  rewardsBalance: BigNumber | undefined;
  totalRewardsQueryKey: readonly [ChainId | undefined, Account | undefined, "staking", "rewards", ContractAddress | undefined];
};

export const useTotalRewardsBalance = buildQueryHook<BigNumber, ["staking", "rewards", Account | undefined], [stakerAddress: Account | undefined]>(
  async ({chainId, library, key: [_staking, _rewards, stakerAddress]}) => {
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
  () => constants.Zero,
);
