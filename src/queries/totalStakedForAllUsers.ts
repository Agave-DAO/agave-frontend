import { BigNumber } from "@ethersproject/bignumber";
import { ErrorCode } from "@ethersproject/logger";
import { StakedToken__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export const useTotalStakedForAllUsers =
  buildQueryHookWhenParamsDefinedChainAddrs<
    BigNumber,
    [_prefixStaking: "staking", _prefixRewards: "totalSupply"],
    []
  >(
    async params => {
      const contract = StakedToken__factory.connect(
        params.chainAddrs.staking,
        params.library
      );
      let balance;
      try {
        balance = await contract.totalSupply();
      } catch (e) {
        if (e.code === ErrorCode.CALL_EXCEPTION) {
          return BigNumber.from(0);
        }
        throw e;
      }
      return balance;
    },
    () => ["staking", "totalSupply"],
    () => undefined
  );
