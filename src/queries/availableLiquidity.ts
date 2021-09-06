import { BigNumber } from "@ethersproject/bignumber";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { ReserveOrNativeTokenDefinition } from "./allReserveTokens";
import { useProtocolReserveData } from "./protocolReserveData";

export const useAvailableLiquidity =
  buildQueryHookWhenParamsDefinedChainAddrs<
    BigNumber,
    [_p1: "asset", asset: ReserveOrNativeTokenDefinition | undefined, _p2: "availableLiquidity"],
    [asset: ReserveOrNativeTokenDefinition]
  >(
    async (params, asset) => {
      const reserveData = await useProtocolReserveData.fetchQueryDefined(
        params,
        asset
      );
      return reserveData.availableLiquidity;
    },
    asset => ["asset", asset, "availableLiquidity"],
    () => undefined,
    {
      staleTime: 5 * 1000,
      cacheTime: 30 * 1000,
    }
  );
