import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { constants } from "ethers";
import { Erc20abi__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { useAllReserveTokens } from "./allReserveTokens";
import { useAssetPriceInDaiWei } from "./assetPriceInDai";
import { useLendingReserveData } from "./lendingReserveData";

export function weiPerToken(decimals: BigNumberish): BigNumber {
  return BigNumber.from(10).pow(decimals);
}

export const useMarketSize = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [_p1: "market", _p2: "size", assetAddress: string | undefined],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const [priceInDaiWei, reserveData] = await Promise.all([
      useAssetPriceInDaiWei.fetchQueryDefined(params, assetAddress),
      useLendingReserveData.fetchQueryDefined(params, assetAddress),
    ]);

    const atoken = Erc20abi__factory.connect(
      reserveData.aTokenAddress,
      params.library.getSigner()
    );
    const atokenTotalSupply = await atoken.totalSupply();

    return atokenTotalSupply.mul(priceInDaiWei);
  },
  assetAddress => ["market", "size", assetAddress],
  () => undefined,
  {
    staleTime: 15 * 1000,
    cacheTime: 120 * 1000,
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
    return sizes.reduce((a, b) => a.add(b), constants.Zero);
  },
  () => ["market", "size", "total"],
  () => undefined,
  {
    staleTime: 30 * 1000,
    cacheTime: 120 * 1000,
  }
);
