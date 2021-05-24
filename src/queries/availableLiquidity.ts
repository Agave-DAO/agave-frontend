import { BigNumber } from "@ethersproject/bignumber";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { useProtocolReserveData } from "./protocolReserveData";

export const useAvailableLiquidity =
  buildQueryHookWhenParamsDefinedChainAddrs<
    BigNumber,
    [_p1: "asset", assetAddress: string | undefined, _p2: "availableLiquidity"],
    [assetAddress: string]
  >(
    async (params, assetAddress) => {
      const reserveData = await useProtocolReserveData.fetchQueryDefined(
        params,
        assetAddress
      );
      return reserveData.availableLiquidity;
    },
    assetAddress => ["asset", assetAddress, "availableLiquidity"],
    () => undefined,
    {
      staleTime: 5 * 1000,
      cacheTime: 30 * 1000,
    }
  );
