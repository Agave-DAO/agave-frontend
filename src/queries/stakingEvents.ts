import { BigNumber } from "@ethersproject/bignumber";
import { ErrorCode } from "@ethersproject/logger";
import { StakedToken__factory } from "../contracts";
import { getChainAddresses } from "../utils/chainAddresses";
import { Account, buildQueryHook } from "../utils/queryBuilder";

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
      library
    );
    let balance;
    try {
      balance = await contract.stakersCooldowns(stakerAddress);
    } catch (e) {
      if (e.code === ErrorCode.CALL_EXCEPTION) {
        return BigNumber.from(0);
      }
      throw e;
    }
    return balance;
  },
  stakerAddress => ["staking", "events", stakerAddress],
  () => undefined
);
