import { BigNumber } from "@ethersproject/bignumber";
import { ErrorCode } from "@ethersproject/logger";
import { StakedToken__factory } from "../contracts";
import { getChainAddresses } from "../utils/chainAddresses";
import { Account, buildQueryHook } from "../utils/queryBuilder";

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
      if (e.code === ErrorCode.CALL_EXCEPTION) {
        return BigNumber.from(0);
      }
      throw e;
    }
    return balance;
  },
  addr => ["staking", "rewards", addr],
  () => undefined
);
