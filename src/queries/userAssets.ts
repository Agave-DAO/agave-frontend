import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { Erc20abi__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { useAllATokens } from "./allATokens";
import { useAllReserveTokens } from "./allReserveTokens";
import { useUserReserveData } from "./protocolReserveData";
import { useAssetPriceInDaiWei } from "./assetPriceInDai";
import { useDecimalCountForToken, weiPerToken } from "./decimalsForToken";
import {
  ExtendedReserveTokenDefinition,
  useAllReserveTokensWithData,
} from "./lendingReserveData";

export const useUserNativeBalance = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [_p1: "user", _p2: "native", _p3: "balance"],
  []
>(
  async params => params.library.getBalance(params.account),
  () => ["user", "native", "balance"],
  () => undefined,
  {
    staleTime: 2 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  }
);

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

export const useUserAssetAllowance = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [
    _p1: "user",
    _p2: "asset",
    assetAddress: string | undefined,
    _p3: "allowance",
    spender: string | undefined
  ],
  [assetAddress: string, spender: string]
>(
  async (params, assetAddress, spender) => {
    const asset = Erc20abi__factory.connect(
      assetAddress,
      params.library.getSigner()
    );

    return asset.allowance(params.account, spender);
  },
  (assetAddress, spender) => [
    "user",
    "asset",
    assetAddress,
    "allowance",
    spender,
  ],
  () => undefined,
  {
    staleTime: 2 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  }
);

export const useUserVariableDebtForAsset =
  buildQueryHookWhenParamsDefinedChainAddrs<
    BigNumber,
    [_p1: "user", _p2: "asset", assetAddress: string | undefined, _p3: "debt"],
    [assetAddress: string]
  >(
    async (params, assetAddress) => {
      return useUserReserveData
        .fetchQueryDefined(params, assetAddress)
        .then(result => result.currentVariableDebt);
    },
    assetAddress => ["user", "asset", assetAddress, "debt"],
    () => undefined,
    {
      staleTime: 2 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
    }
  );

export const useUserVariableDebtTokenBalances =
  buildQueryHookWhenParamsDefinedChainAddrs<
    { symbol: string; tokenAddress: string; balance: BigNumber }[],
    [_p1: "user", _p2: "allReserves", _p3: "debts"],
    []
  >(
    async params => {
      const reserves = await useAllReserveTokens.fetchQueryDefined(params);

      const reservesWithVariableDebt = await Promise.all(
        reserves.map(reserve =>
          useUserVariableDebtForAsset
            .fetchQueryDefined(params, reserve.tokenAddress)
            .then(debt => ({ ...reserve, balance: debt }))
        )
      );

      return reservesWithVariableDebt;
    },
    () => ["user", "allReserves", "debts"],
    () => undefined,
    {
      refetchOnMount: true,
      staleTime: 2 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
    }
  );

export interface VariableDebtTokenBalancesDaiWei {
  symbol: string;
  tokenAddress: string;
  balance: BigNumber;
  decimals: BigNumberish;
  daiWeiPricePer: BigNumber | null;
  daiWeiPriceTotal: BigNumber | null;
}

export const useUserVariableDebtTokenBalancesDaiWei =
  buildQueryHookWhenParamsDefinedChainAddrs<
    VariableDebtTokenBalancesDaiWei[],
    [_p1: "user", _p2: "allReserves", _p3: "debts", _p4: "dai"],
    []
  >(
    async params => {
      const reserves = await useUserVariableDebtTokenBalances.fetchQueryDefined(
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
            daiWeiPriceTotal:
              daiPricePerToken
                ?.mul(reserve.balance)
                .div(weiPerToken(decimals)) ?? null,
            decimals,
          }))
        )
      );

      return withDaiPrices;
    },
    () => ["user", "allReserves", "debts", "dai"],
    () => undefined,
    {
      refetchOnMount: true,
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

interface ReserveAssetBalancesDaiWei {
  symbol: string;
  tokenAddress: string;
  balance: BigNumber;
  decimals: BigNumberish;
  daiWeiPricePer: BigNumber | null;
  daiWeiPriceTotal: BigNumber | null;
}

export const useUserReserveAssetBalancesDaiWei =
  buildQueryHookWhenParamsDefinedChainAddrs<
    ReserveAssetBalancesDaiWei[],
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
            daiWeiPriceTotal:
              daiPricePerToken
                ?.mul(reserve.balance)
                .div(weiPerToken(decimals)) ?? null,
            decimals,
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

export const useUserDepositAssetBalances =
  buildQueryHookWhenParamsDefinedChainAddrs<
    { symbol: string; tokenAddress: string; balance: BigNumber }[],
    [_p1: "user", _p2: "allDeposits", _p3: "balances"],
    []
  >(
    async params => {
      const aTokens = await useAllATokens.fetchQueryDefined(params);

      const aTokensWithBalances = await Promise.all(
        aTokens.map(reserve =>
          useUserAssetBalance
            .fetchQueryDefined(params, reserve.tokenAddress)
            .then(result => ({ ...reserve, balance: result }))
        )
      );
      return aTokensWithBalances;
    },
    () => ["user", "allDeposits", "balances"],
    () => undefined,
    {
      refetchOnMount: true,
      staleTime: 2 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
    }
  );

export const useUserDepositAssetBalancesWithReserveInfo =
  buildQueryHookWhenParamsDefinedChainAddrs<
    {
      symbol: string;
      tokenAddress: string;
      balance: BigNumber;
      reserve: ExtendedReserveTokenDefinition;
    }[],
    [_p1: "user", _p2: "allDeposits", _p3: "balances", _p4: "withReserveInfo"],
    []
  >(
    async params => {
      const [reservesInfo, aTokensWithBalances] = await Promise.all([
        useAllReserveTokensWithData.fetchQueryDefined(params),
        useUserDepositAssetBalances.fetchQueryDefined(params),
      ]);

      const reservesByATokenAddr = Object.fromEntries(
        reservesInfo.map(reserve => [reserve.aTokenAddress, reserve])
      );

      return aTokensWithBalances.map(a => {
        const reserve = reservesByATokenAddr[a.tokenAddress];
        if (!reserve) {
          throw new Error(
            `No matching reserve found for aToken ${a.symbol} : ${a.tokenAddress}`
          );
        }
        return { ...a, reserve };
      });
    },
    () => ["user", "allDeposits", "balances", "withReserveInfo"],
    () => undefined,
    {
      refetchOnMount: true,
      staleTime: 2 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
    }
  );

export interface DepositAssetBalancesDaiWei {
  symbol: string;
  aSymbol: string;
  tokenAddress: string;
  aTokenAddress: string;
  balance: BigNumber;
  daiWeiPricePer: BigNumber | null;
  daiWeiPriceTotal: BigNumber | null;
}

export const useUserDepositAssetBalancesDaiWei =
  buildQueryHookWhenParamsDefinedChainAddrs<
    DepositAssetBalancesDaiWei[],
    [_p1: "user", _p2: "allDeposits", _p3: "balances", _p4: "dai"],
    []
  >(
    async params => {
      const [aTokens, reserves, reserveInfo] = await Promise.all([
        useAllATokens.fetchQueryDefined(params).then(result =>
          Promise.all(
            result.map(aToken =>
              useUserAssetBalance
                .fetchQueryDefined(params, aToken.tokenAddress)
                .then(aTokenBalance => ({
                  ...aToken,
                  balance: aTokenBalance,
                }))
            )
          )
        ),
        useUserReserveAssetBalancesDaiWei.fetchQueryDefined(params),
        useAllReserveTokensWithData.fetchQueryDefined(params),
      ]);

      const reservesByTokenAddr = Object.fromEntries(
        reserves.map(r => [r.tokenAddress, r])
      );

      const reservesByATokenAddr = Object.fromEntries(
        reserveInfo.map(r => [r.aTokenAddress, r])
      );

      const withDaiPrices: DepositAssetBalancesDaiWei[] = [];
      for (const at of aTokens) {
        const reserveInfo = reservesByATokenAddr[at.tokenAddress];
        if (!reserveInfo) {
          console.warn("Equivalent reserve not present for aToken:", at);
          continue;
        }
        const reserve = reservesByTokenAddr[reserveInfo.tokenAddress]!;
        withDaiPrices.push({
          aSymbol: at.symbol,
          symbol: reserve.symbol,
          aTokenAddress: at.tokenAddress,
          tokenAddress: reserve.tokenAddress,
          balance: at.balance,
          daiWeiPricePer: reserve.daiWeiPricePer,
          daiWeiPriceTotal: reserve.daiWeiPricePer
            ? at.balance
                .mul(reserve.daiWeiPricePer)
                .div(weiPerToken(reserve.decimals))
            : null,
        });
      }

      return withDaiPrices;
    },
    () => ["user", "allDeposits", "balances", "dai"],
    () => undefined,
    {
      refetchOnMount: true,
      staleTime: 2 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
    }
  );
