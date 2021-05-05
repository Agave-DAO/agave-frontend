import { useQuery } from "react-query";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from '@ethersproject/providers';
import { ErrorCode } from "@ethersproject/logger";

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
  key: readonly [ChainId | undefined, Account | undefined, ...TKey];
}

export function buildQueryHook<TData, TKey extends readonly unknown[], TParams extends unknown[]>(
  invoke: (args: QueryHookParams<TKey>, ...params: TParams) => Promise<TData | undefined>,
  buildKey: (...params: TParams) => TKey,
  buildInitialData?: (() => TData | undefined) | undefined,
): (...params: TParams) => QueryHookResult<TData, TKey> {
  const x = (...params: TParams) => {
    const { account, library, chainId } = useWeb3React<Web3Provider>();
    const queryKey = [chainId ?? undefined, account ?? undefined, ...buildKey(...params)] as const;
    
    const {
      data,
      error,
    } = useQuery(
      queryKey,
      async (ctx): Promise<TData | undefined> => {
        const [chainId, account, ...innerKey] = ctx.queryKey;
        if (!account || !chainId || !library) {
          return undefined;
        }
        return await invoke({ account, chainId, library, key: innerKey }, ...params);
      },
      {
        initialData: buildInitialData?.(),
        staleTime: 1 * 60 * 1000,
        retry: (failureCount, err) => {
          if (failureCount > 3) {
            return false;
          }
          const code = (err as (Error & { code?: ErrorCode })).code;
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
      }
    );
    return { data, key: queryKey };
  };
  return x;
}
