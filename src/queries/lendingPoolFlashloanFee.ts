import { FixedNumber } from "@ethersproject/bignumber";
import { AgaveLendingABI__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export const useFlashLoanFee = buildQueryHookWhenParamsDefinedChainAddrs<
  FixedNumber,
  [_p1: "LendingPool", _p2: "flashLoanFee"],
  []
>(
  async params => {
    const lendingPool = AgaveLendingABI__factory.connect(
      params.chainAddrs.lendingPool,
      params.library.getSigner()
    );
    return lendingPool
      .FLASHLOAN_PREMIUM_TOTAL()
      .then(premium => FixedNumber.fromValue(premium, 4));
  },
  () => ["LendingPool", "flashLoanFee"],
  () => undefined,
  {
    cacheTime: 7 * 24 * 60 * 60 * 1000,
    staleTime: 1 * 24 * 60 * 60 * 1000,
  }
);
