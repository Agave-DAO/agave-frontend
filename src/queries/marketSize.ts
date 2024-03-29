import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import { constants } from "ethers";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { useAllReserveTokens } from "./allReserveTokens";
import { useAssetPriceInDaiWei } from "./assetPriceInDai";
import { useDecimalCountForToken, weiPerToken } from "./decimalsForToken";
import { useLendingReserveData } from "./lendingReserveData";
import { useTokenTotalSupply } from "./tokenTotalSupply";

export const useMarketSize = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber | null,
  [_p1: "market", _p2: "size", assetAddress: string | undefined],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const [priceInDaiWei, reserveData] = await Promise.all([
      useAssetPriceInDaiWei.fetchQueryDefined(params, assetAddress),
      useLendingReserveData.fetchQueryDefined(params, assetAddress),
    ]);

    const [aTokenTotalSupply, aTokenDecimals] = await Promise.all([
      useTokenTotalSupply.fetchQueryDefined(params, reserveData.aTokenAddress),
      useDecimalCountForToken.fetchQueryDefined(
        params,
        reserveData.aTokenAddress
      ),
    ]);

    return priceInDaiWei
      ? aTokenTotalSupply.mul(priceInDaiWei).div(weiPerToken(aTokenDecimals))
      : null;
  },
  assetAddress => ["market", "size", assetAddress],
  () => undefined,
  {
    staleTime: 30 * 1000,
    cacheTime: 360 * 1000,
  }
);

export const useTotalMarketSize = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [_p1: "market", _p2: "size", _p3: "total"],
  []
>(
  async params => {
    const reserves = await useAllReserveTokens.fetchQueryDefined(params);
    const sizes = await Promise.all(
      reserves.map(reserve =>
        useMarketSize.fetchQueryDefined(params, reserve.tokenAddress)
      )
    );
    return sizes.reduce(
      (a: BigNumber, b: BigNumber | null): BigNumber =>
        a.add(b ?? constants.Zero),
      constants.Zero
    );
  },
  () => ["market", "size", "total"],
  () => undefined,
  {
    staleTime: 30 * 1000,
    cacheTime: 120 * 1000,
  }
);

export const useMarketSizeInDai = buildQueryHookWhenParamsDefinedChainAddrs<
  FixedNumber | null,
  [_p1: "market", _p2: "size", assetAddress: string | undefined, _p3: "dai"],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const totalWei = await useMarketSize.fetchQueryDefined(params, assetAddress);
    return totalWei ? FixedNumber.fromValue(totalWei, 18) : null; // HACK: Assumes DAI are always 18 decimals
  },
  assetAddress => ["market", "size", assetAddress, "dai"],
  () => undefined
);
