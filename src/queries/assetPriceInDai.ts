import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import { parseUnits } from "@ethersproject/units";
import { constants } from "ethers";
import React from "react";
import { AaveOracle__factory, WETHGateway__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { useWrappedNativeAddress } from "./wrappedNativeAddress";

type Tail<T extends [unknown, ...unknown[]]> = T extends [unknown, ...infer X]
  ? [...X]
  : never;

export const useAssetPriceInDaiWei = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [_p1: "prices", _p2: "dai", _p3: "asset", assetAddress: string | undefined],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const contract = AaveOracle__factory.connect(
      params.chainAddrs.agaveOracle,
      params.library.getSigner()
    );
    return await contract.getAssetPrice(assetAddress); // price in dai per token
  },
  assetAddress => ["prices", "dai", "asset", assetAddress],
  () => undefined
);

// Mappers apply *after* the cache, so we can reuse the same cache and invocation when mapping
export const useAssetPriceInDai = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  // A trick to compensate for buildKey including chainId and account
  Tail<Tail<ReturnType<typeof useAssetPriceInDaiWei.buildKey>>>,
  [assetAddress: string],
  FixedNumber
>(
  useAssetPriceInDaiWei.invokeWhenDefined,
  // HACK: make a buildKey utility on queryBuilder that doesn't include chainId and account
  (...args) => {
    const [, , ...res] = useAssetPriceInDaiWei.buildKey(
      undefined,
      undefined,
      ...args
    );
    return [...res];
  },
  () => undefined,
  undefined,
  res => FixedNumber.fromValue(res, 18)
);

export const useAssetPricesInDaiWei = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber[],
  [
    _p1: "prices",
    _p2: "dai",
    _p3: "assets",
    assetAddresses: string[] | undefined
  ],
  [assetAddresses: string[]]
>(
  async (params, assetAddresses) => {
    const contract = AaveOracle__factory.connect(
      params.chainAddrs.agaveOracle,
      params.library.getSigner()
    );
    return await contract.getAssetsPrices(assetAddresses); // price in dai per token
  },
  assetAddresses => ["prices", "dai", "assets", assetAddresses],
  () => undefined
);

// (dai / source) / (dai / target) = (target / source)
export function calculateRelativeTokenPrice(
  daiPerSourceToken: FixedNumber,
  daiPerTargetToken: FixedNumber
): FixedNumber {
  const maxDecimals = Math.max(
    daiPerSourceToken.format.decimals,
    daiPerTargetToken.format.decimals
  );
  const aWei = parseUnits(daiPerSourceToken.toString(), maxDecimals);
  const bWei = parseUnits(daiPerTargetToken.toString(), maxDecimals);
  return FixedNumber.fromValue(
    aWei.mul(constants.WeiPerEther).div(bWei),
    maxDecimals
  );
}

export function useAssetPriceInNative(
  assetAddress: string | undefined
):
  | { data: undefined; error: unknown }
  | { data: FixedNumber; error: undefined }
  | undefined {
  const { data: nativeAddress, error: eNativeAddress } =
    useWrappedNativeAddress();
  const { data: assetPrice, error: eDaiPrice } =
    useAssetPriceInDai(assetAddress);
  const { data: wethPrice, error: eNativePrice } =
    useAssetPriceInDai(nativeAddress);
  return React.useMemo(() => {
    const error = eNativeAddress ?? eDaiPrice ?? eNativePrice;
    if (error) {
      return {
        error,
        data: undefined,
      };
    } else {
      // (dai / token) / (dai / weth) = (weth / token)
      const wethPerDai =
        assetPrice && wethPrice
          ? calculateRelativeTokenPrice(assetPrice, wethPrice)
          : undefined;
      return {
        data: wethPerDai,
        error: undefined,
      };
    }
  }, [assetPrice, wethPrice, eNativeAddress, eDaiPrice, eNativePrice]);
}
