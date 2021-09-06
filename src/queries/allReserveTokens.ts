import React from "react";
import { AaveProtocolDataProvider__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import {
  useProtocolReserveConfiguration,
  ReserveAssetConfiguration,
} from "./protocolAssetConfiguration";
import { useWrappedNativeDefinition } from "./wrappedNativeAddress";

export const NATIVE_TOKEN: unique symbol = Symbol.for("NativeToken");
// eslint-disable-next-line
export type NATIVE_TOKEN = typeof NATIVE_TOKEN;

export interface TokenDefinition {
  readonly symbol: string;
  readonly tokenAddress: string | NATIVE_TOKEN;
}

export interface ReserveTokenDefinition extends TokenDefinition {
  readonly symbol: string;
  readonly tokenAddress: string;
}

export interface NativeTokenDefinition extends TokenDefinition {
  readonly symbol: string;
  readonly tokenAddress: NATIVE_TOKEN;
}

export type ReserveOrNativeTokenDefinition =
  | ReserveTokenDefinition
  | NativeTokenDefinition;

export function isNativeTokenDefinition(
  definition: Readonly<ReserveOrNativeTokenDefinition> | null | undefined
): definition is Readonly<NativeTokenDefinition> {
  return definition?.tokenAddress === NATIVE_TOKEN;
}

export function isReserveTokenDefinition(
  definition: Readonly<ReserveOrNativeTokenDefinition> | null | undefined
): definition is Readonly<ReserveTokenDefinition> {
  const addr = definition?.tokenAddress;
  return addr !== NATIVE_TOKEN && typeof addr === "string";
}

export function selectReserveTokenAddress(
  item: string | NATIVE_TOKEN | ReserveOrNativeTokenDefinition
): string | NATIVE_TOKEN;
export function selectReserveTokenAddress(
  item: string | NATIVE_TOKEN | ReserveOrNativeTokenDefinition | undefined
): string | NATIVE_TOKEN | undefined;
export function selectReserveTokenAddress(
  item: string | NATIVE_TOKEN | ReserveOrNativeTokenDefinition | undefined
): string | NATIVE_TOKEN | undefined {
  if (item === undefined) {
    return item;
  } else if (item === NATIVE_TOKEN || typeof item === "string") {
    // Keep as-is
    return item;
  } else if (isReserveTokenDefinition(item)) {
    return item.tokenAddress;
  } else if (isNativeTokenDefinition(item)) {
    return NATIVE_TOKEN;
  }
}

export const useAllReserveTokens = buildQueryHookWhenParamsDefinedChainAddrs<
  ReadonlyArray<ReserveTokenDefinition>,
  [_p1: "AaveProtocolDataProvider", _p2: "getAllReserveTokens"],
  []
>(
  async params => {
    const contract = AaveProtocolDataProvider__factory.connect(
      params.chainAddrs.aaveProtocolDataProvider,
      params.library
    );
    return await contract.getAllReservesTokens();
  },
  () => ["AaveProtocolDataProvider", "getAllReserveTokens"],
  () => undefined,
  {
    cacheTime: Infinity,
    staleTime: Infinity,
  }
);

export interface ReserveTokensConfiguration
  extends ReserveTokenDefinition,
    ReserveAssetConfiguration {}

export const useAllReserveTokensWithConfiguration =
  buildQueryHookWhenParamsDefinedChainAddrs<
    ReserveTokensConfiguration[],
    [_p1: "AaveProtocolDataProvider", _p2: "assetConfiguration"],
    []
  >(
    async params => {
      const allReserves = await useAllReserveTokens.fetchQueryDefined(params);

      const reservesWithData = await Promise.all(
        allReserves.map(reserve =>
          useProtocolReserveConfiguration
            .fetchQueryDefined(params, reserve.tokenAddress)
            .then(
              (data): ReserveTokensConfiguration => ({
                ...data,
                ...reserve,
              })
            )
        )
      );

      return reservesWithData;
    },
    () => ["AaveProtocolDataProvider", "assetConfiguration"],
    () => undefined,
    {
      cacheTime: 60 * 15 * 1000,
      staleTime: 60 * 5 * 1000,
    }
  );

export function useTokenDefinitionBySymbol(assetName: string | undefined): {
  token: ReserveOrNativeTokenDefinition | undefined;
  allReserves: readonly ReserveTokenDefinition[] | undefined;
  wrappedNativeToken: ReserveTokenDefinition | undefined;
} {
  const allReserves = useAllReserveTokens();
  const { data: wrappedNativeToken } = useWrappedNativeDefinition();
  const asset = React.useMemo(() => {
    if (assetName === undefined) {
      return undefined;
    }
    const lowercaseAssetName = assetName?.toLowerCase();
    const foundReserve = allReserves?.data?.find(
      asset => asset.symbol.toLowerCase() === lowercaseAssetName
    );
    // If the reserve isn't defined, but we know about our wrapped token...
    if (foundReserve === undefined && wrappedNativeToken !== undefined) {
      const wrappedWithoutW = wrappedNativeToken.symbol.replace(/^[wW]/, "");
      // And if the asset we're looking at matches wrapped minus the W...
      if (assetName === wrappedWithoutW) {
        const native: NativeTokenDefinition = {
          symbol: wrappedWithoutW,
          tokenAddress: NATIVE_TOKEN,
        };
        // Return it early, because we know it's the wrapped token
        return native;
      }
      // Otherwise, default to found reserve, which is undefined in this context
    }
    return foundReserve;
  }, [allReserves, assetName, wrappedNativeToken]);
  return React.useMemo(
    () => ({
      allReserves: allReserves.data,
      wrappedNativeToken,
      token: asset,
    }),
    [asset, allReserves, wrappedNativeToken]
  );
}

export function useTokenDefinitionByAddress(
  assetAddress: string | NATIVE_TOKEN | undefined
): {
  token: ReserveOrNativeTokenDefinition | undefined;
  allReserves: readonly ReserveTokenDefinition[] | undefined;
} {
  const allReserves = useAllReserveTokens();
  const { data: wrappedNativeToken } = useWrappedNativeDefinition();
  const asset = React.useMemo(() => {
    if (assetAddress === undefined) {
      return undefined;
    }
    if (assetAddress === NATIVE_TOKEN) {
      return wrappedNativeToken;
    }
    const foundReserve = allReserves?.data?.find(
      asset => asset.tokenAddress.toLowerCase() === assetAddress.toLowerCase()
    );
    return foundReserve;
  }, [allReserves, assetAddress, wrappedNativeToken]);
  return React.useMemo(
    () => ({
      allReserves: allReserves.data,
      token: asset,
    }),
    [asset, allReserves]
  );
}
