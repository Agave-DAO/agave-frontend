import { useQuery, UseQueryOptions } from "react-query";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ErrorCode } from "@ethersproject/logger";
import React from "react";
import { ChainAddresses } from "./contracts/contractAddresses/internalAddresses";
import { getChainAddresses } from "./chainAddresses";

export type ChainId = number;
export type Account = string;
export type ContractAddress = string;

export interface QueryHookParams<TKey extends readonly unknown[]> {
  account: string;
  chainId: number;
  library: Web3Provider;
  key: TKey;
}

export interface QueryHookResult<TData, TKey extends readonly unknown[]> {
  data: TData | undefined;
  error: unknown | undefined;
  key: readonly [ChainId | undefined, Account | undefined, ...TKey];
}

export function buildQueryHook<
  TData,
  TKey extends readonly unknown[],
  TArgs extends unknown[]
>(
  invoke: (
    hookParams: QueryHookParams<TKey>,
    ...args: TArgs
  ) => Promise<TData | undefined>,
  buildKey: (...args: TArgs) => TKey,
  buildInitialData?: (() => TData | undefined) | undefined
): (...params: TArgs) => QueryHookResult<TData, TKey> {
  function useBuiltQueryHook(...params: TArgs) {
    const { account, library, chainId } = useWeb3React<Web3Provider>();
    const queryKey = React.useMemo(
      () =>
        [
          chainId ?? undefined,
          account ?? undefined,
          ...buildKey(...params),
        ] as const,
      // eslint-disable-next-line
      [chainId, account, library, ...params]
    );

    const queryOpts: UseQueryOptions<
      TData | undefined,
      unknown,
      TData,
      typeof queryKey
    > = React.useMemo(
      () => ({
        initialData: buildInitialData?.(),
        staleTime: 1 * 60 * 1000,
        retry: (failureCount, err) => {
          if (failureCount > 3) {
            return false;
          }
          const code = (err as Error & { code?: ErrorCode }).code;
          if (code !== undefined) {
            switch (code) {
              case ErrorCode.NETWORK_ERROR:
              case ErrorCode.TIMEOUT:
                return true;
              case ErrorCode.NUMERIC_FAULT:
              default:
                return false;
            }
          }
          return true;
        },
      }),
      [] // buildInitialData is provided when declaring the hook type, not per call
    );

    const { data, error } = useQuery(
      queryKey,
      async (ctx): Promise<TData | undefined> => {
        const [chainId, account, ...innerKey] = ctx.queryKey;
        if (!account || !chainId || !library) {
          return undefined;
        }
        return await invoke(
          {
            account,
            chainId: chainId as number,
            library,
            // HACK: Any Cast to fix unexpected type error
            key: innerKey as any,
          },
          ...params
        );
      },
      queryOpts
    );
    return { data, error, key: queryKey };
  }
  return (useBuiltQueryHook as any).bind({});
}

// Given a tuple type, strips `U` from the types in each slot
type ExcludeTuple<T, U> = T extends unknown[]
  ? { [K in keyof T]: Exclude<T[K], U> }
  : never;
// Given a tuple type, strips `undefined` from all slots
type AllDefined<T> = ExcludeTuple<T, undefined>;
type AllOrUndefined<T> = T extends unknown[]
  ? { [K in keyof T]: T[K] | undefined }
  : never;

export function buildQueryHookWhenParamsDefined<
  TData,
  TKey extends readonly unknown[],
  TArgs extends unknown[]
>(
  invokeWhenDefined: (
    hookParams: QueryHookParams<TKey>,
    ...args: AllDefined<TArgs>
  ) => Promise<TData>,
  buildKey: (...args: AllOrUndefined<TArgs>) => TKey,
  buildInitialData?: (() => TData | undefined) | undefined
): (...params: AllOrUndefined<TArgs>) => QueryHookResult<TData, TKey> {
  return buildQueryHook<TData, TKey, AllOrUndefined<TArgs>>(
    (hookParams, ...args: AllOrUndefined<TArgs>) =>
      args.every(a => a !== undefined)
        ? invokeWhenDefined(hookParams, ...(args as AllDefined<TArgs>))
        : Promise.resolve(undefined),
    buildKey,
    buildInitialData
  );
}

export interface ContractQueryHookParams<TKey extends readonly unknown[]>
  extends QueryHookParams<TKey> {
  chainAddrs: ChainAddresses;
}

export function buildQueryHookWhenParamsDefinedChainAddrs<
  TData,
  TKey extends readonly unknown[],
  TArgs extends unknown[]
>(
  invokeWhenDefined: (
    hookParams: ContractQueryHookParams<TKey>,
    ...args: AllDefined<TArgs>
  ) => Promise<TData>,
  buildKey: (...args: AllOrUndefined<TArgs>) => TKey,
  buildInitialData?: (() => TData | undefined) | undefined
): (...params: AllOrUndefined<TArgs>) => QueryHookResult<TData, TKey> {
  return buildQueryHook<TData, TKey, AllOrUndefined<TArgs>>(
    (hookParams, ...args: AllOrUndefined<TArgs>) => {
      const chainAddrs =
        hookParams.chainId !== undefined
          ? getChainAddresses(hookParams.chainId)
          : undefined;
      return chainAddrs !== undefined && args.every(a => a !== undefined)
        ? invokeWhenDefined(
            { chainAddrs, ...hookParams },
            ...(args as AllDefined<TArgs>)
          )
        : Promise.resolve(undefined);
    },
    buildKey,
    buildInitialData
  );
}
