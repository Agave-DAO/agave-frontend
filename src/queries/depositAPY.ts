import { FixedNumber } from "@ethersproject/bignumber";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { useProtocolReserveData } from "./protocolReserveData";

export const useDepositAPY = buildQueryHookWhenParamsDefinedChainAddrs<
  FixedNumber,
  [_p1: "asset", assetAddress: string | undefined, _p2: "depositAPY"],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const { liquidityRate } = await useProtocolReserveData.fetchQueryDefined(
      params,
      assetAddress
    );
    return liquidityRate;
  },
  assetAddress => ["asset", assetAddress, "depositAPY"],
  () => undefined,
  {
    staleTime: 5 * 1000,
    cacheTime: 30 * 1000,
  }
);

export const useVariableBorrowAPR = buildQueryHookWhenParamsDefinedChainAddrs<
  FixedNumber,
  [_p1: "asset", assetAddress: string | undefined, _p2: "variableBorrowAPR"],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const { variableBorrowRate } =
      await useProtocolReserveData.fetchQueryDefined(params, assetAddress);
    return variableBorrowRate;
  },
  assetAddress => ["asset", assetAddress, "variableBorrowAPR"],
  () => undefined,
  {
    staleTime: 5 * 1000,
    cacheTime: 30 * 1000,
  }
);

export const useStableBorrowAPR = buildQueryHookWhenParamsDefinedChainAddrs<
  FixedNumber,
  [_p1: "asset", assetAddress: string | undefined, _p2: "stableBorrowAPR"],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const { stableBorrowRate } = await useProtocolReserveData.fetchQueryDefined(
      params,
      assetAddress
    );
    return stableBorrowRate;
  },
  assetAddress => ["asset", assetAddress, "stableBorrowAPR"],
  () => undefined,
  {
    staleTime: 5 * 1000,
    cacheTime: 30 * 1000,
  }
);
