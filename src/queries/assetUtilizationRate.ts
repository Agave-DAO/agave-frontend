import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
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
    [_p1: "asset", assetAddress: string | undefined, _p2: "utilizationRate"],
    [assetAddress: string]
  >(
    async (params, assetAddress) => {
      const reserveData = await useProtocolReserveData.fetchQueryDefined(
        params,
        assetAddress
      );
      const totalDebt = reserveData.totalStableDebt.add(
        reserveData.totalVariableDebt
      );
      return {
        totalDebt,
        totalStableDebt: reserveData.totalStableDebt,
        totalVariableDebt: reserveData.totalVariableDebt,
        availableLiquidity: reserveData.availableLiquidity,
        utilizationRate: FixedNumber.from(totalDebt).divUnsafe(
          FixedNumber.from(totalDebt.add(reserveData.availableLiquidity))
        ),
      };
    },
    assetAddress => ["asset", assetAddress, "utilizationRate"],
    () => undefined,
    {
      staleTime: 5 * 1000,
      cacheTime: 30 * 1000,
    }
  );
