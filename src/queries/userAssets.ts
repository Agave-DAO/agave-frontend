import { BigNumber } from "@ethersproject/bignumber";
import { Erc20abi__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { useAllReserveTokens } from "./allReserveTokens";
import { useAssetPriceInDaiWei } from "./assetPriceInDai";
import { useDecimalCountForToken, weiPerToken } from "./decimalsForToken";

export const useUserAssetBalance = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [_p1: "user", _p2: "asset", assetAddress: string | undefined, _p3: "balance"],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const asset = Erc20abi__factory.connect(
      assetAddress,
      params.library.getSigner()
    );

    return asset.balanceOf(params.account);
  },
  assetAddress => ["user", "asset", assetAddress, "balance"],
  () => undefined,
  {
    staleTime: 2 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  }
);

export const useUserReserveAssetBalances =
  buildQueryHookWhenParamsDefinedChainAddrs<
    { symbol: string; tokenAddress: string; balance: BigNumber }[],
    [_p1: "user", _p2: "allReserves", _p3: "balances"],
    []
  >(
    async params => {
      const reserves = await useAllReserveTokens.fetchQueryDefined(params);

      const reservesWithBalances = await Promise.all(
        reserves.map(reserve =>
          useUserAssetBalance
            .fetchQueryDefined(params, reserve.tokenAddress)
            .then(result => ({ ...reserve, balance: result }))
        )
      );

      return reservesWithBalances;
    },
    () => ["user", "allReserves", "balances"],
    () => undefined,
    {
      refetchOnMount: true,
      staleTime: 2 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
    }
  );

export const useUserReserveAssetBalancesDai =
  buildQueryHookWhenParamsDefinedChainAddrs<
    {
      symbol: string;
      tokenAddress: string;
      balance: BigNumber;
      daiWeiPricePer: BigNumber;
      daiWeiPriceTotal: BigNumber;
    }[],
    [_p1: "user", _p2: "allReserves", _p3: "balances", _p4: "dai"],
    []
  >(
    async params => {
      const reserves = await useUserReserveAssetBalances.fetchQueryDefined(
        params
      );
      const withDaiPrices = await Promise.all(
        reserves.map(reserve =>
          Promise.all([
            useAssetPriceInDaiWei.fetchQueryDefined(
              params,
              reserve.tokenAddress
            ),
            useDecimalCountForToken.fetchQueryDefined(
              params,
              reserve.tokenAddress
            ),
          ]).then(([daiPricePerToken, decimals]) => ({
            ...reserve,
            daiWeiPricePer: daiPricePerToken,
            daiWeiPriceTotal: daiPricePerToken
              .mul(reserve.balance)
              .div(weiPerToken(decimals)),
          }))
        )
      );

      return withDaiPrices;
    },
    () => ["user", "allReserves", "balances", "dai"],
    () => undefined,
    {
      refetchOnMount: true,
      staleTime: 2 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
    }
  );
