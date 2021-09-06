import { FixedNumber } from "@ethersproject/bignumber";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { ReserveOrNativeTokenDefinition } from "./allReserveTokens";
import { useProtocolReserveData } from "./protocolReserveData";

export const useDepositAPY = buildQueryHookWhenParamsDefinedChainAddrs<
  FixedNumber,
  [_p1: "asset", asset: ReserveOrNativeTokenDefinition | undefined, _p2: "depositAPY"],
  [asset: ReserveOrNativeTokenDefinition]
>(
  async (params, asset) => {
    const { liquidityRate } = await useProtocolReserveData.fetchQueryDefined(
      params,
      asset
    );
    return liquidityRate;
  },
  asset => ["asset", asset, "depositAPY"],
  () => undefined,
  {
    staleTime: 5 * 1000,
    cacheTime: 30 * 1000,
  }
);

export const useVariableBorrowAPR = buildQueryHookWhenParamsDefinedChainAddrs<
  FixedNumber,
  [_p1: "asset", asset: ReserveOrNativeTokenDefinition | undefined, _p2: "variableBorrowAPR"],
  [asset: ReserveOrNativeTokenDefinition]
>(
  async (params, asset) => {
    const { variableBorrowRate } =
      await useProtocolReserveData.fetchQueryDefined(params, asset);
    return variableBorrowRate;
  },
  asset => ["asset", asset, "variableBorrowAPR"],
  () => undefined,
  {
    staleTime: 5 * 1000,
    cacheTime: 30 * 1000,
  }
);

export const useStableBorrowAPR = buildQueryHookWhenParamsDefinedChainAddrs<
  FixedNumber,
  [_p1: "asset", asset: ReserveOrNativeTokenDefinition | undefined, _p2: "stableBorrowAPR"],
  [asset: ReserveOrNativeTokenDefinition]
>(
  async (params, asset) => {
    const { stableBorrowRate } = await useProtocolReserveData.fetchQueryDefined(
      params,
      asset
    );
    return stableBorrowRate;
  },
  asset => ["asset", asset, "stableBorrowAPR"],
  () => undefined,
  {
    staleTime: 5 * 1000,
    cacheTime: 30 * 1000,
  }
);
