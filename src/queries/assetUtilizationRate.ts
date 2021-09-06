import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import { divIfNotZeroUnsafe } from "../utils/fixedPoint";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { ReserveOrNativeTokenDefinition } from "./allReserveTokens";
import { useProtocolReserveData } from "./protocolReserveData";

export interface AssetUtilizationRateData {
  availableLiquidity: BigNumber;
  totalDebt: BigNumber;
  totalVariableDebt: BigNumber;
  totalStableDebt: BigNumber;
  utilizationRate: FixedNumber;
}

export const useAssetUtilizationRate =
  buildQueryHookWhenParamsDefinedChainAddrs<
    AssetUtilizationRateData,
    [_p1: "asset", asset: ReserveOrNativeTokenDefinition | undefined, _p2: "utilizationRate"],
    [asset: ReserveOrNativeTokenDefinition]
  >(
    async (params, asset) => {
      const reserveData = await useProtocolReserveData.fetchQueryDefined(
        params,
        asset
      );
      const totalDebt = reserveData.totalStableDebt.add(
        reserveData.totalVariableDebt
      );
      return {
        totalDebt,
        totalStableDebt: reserveData.totalStableDebt,
        totalVariableDebt: reserveData.totalVariableDebt,
        availableLiquidity: reserveData.availableLiquidity,
        utilizationRate: divIfNotZeroUnsafe(
          FixedNumber.from(totalDebt),
          FixedNumber.from(totalDebt.add(reserveData.availableLiquidity))
        ),
      };
    },
    asset => ["asset", asset, "utilizationRate"],
    () => undefined,
    {
      staleTime: 5 * 1000,
      cacheTime: 30 * 1000,
    }
  );
