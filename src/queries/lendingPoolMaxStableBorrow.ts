import { FixedNumber } from "@ethersproject/bignumber";
import { AgaveLendingABI__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export const useLendingPoolMaxStableBorrow =
  buildQueryHookWhenParamsDefinedChainAddrs<
    FixedNumber,
    [_p1: "LendingPool", _p2: "maxStableBorrow"],
    []
  >(
    async params => {
      const lendingPool = AgaveLendingABI__factory.connect(
        params.chainAddrs.lendingPool,
        params.library.getSigner()
      );
      return lendingPool
        .MAX_STABLE_RATE_BORROW_SIZE_PERCENT()
        .then(bnFixed4 => FixedNumber.fromValue(bnFixed4, 4));
    },
    () => ["LendingPool", "maxStableBorrow"],
    () => undefined,
    {
      cacheTime: 7 * 24 * 60 * 60 * 1000,
      staleTime: 1 * 24 * 60 * 60 * 1000,
    }
  );
