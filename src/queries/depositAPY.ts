import { FixedNumber } from "@ethersproject/bignumber";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { useProtocolReserveData } from "./protocolReserveData";

export const useDepositAPY = buildQueryHookWhenParamsDefinedChainAddrs<
  FixedNumber,
  [_p1: "asset", assetAddress: string | undefined, _p2: "utilizationRate"],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const { liquidityRate } = await useProtocolReserveData.fetchQueryDefined(
      params,
      assetAddress
    );
    return liquidityRate;
  },
  assetAddress => ["asset", assetAddress, "utilizationRate"],
  () => undefined,
  {
    staleTime: 5 * 1000,
    cacheTime: 30 * 1000,
  }
);
