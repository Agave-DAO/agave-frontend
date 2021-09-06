import { WETHGateway__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { ReserveTokenDefinition } from "./allReserveTokens";
import { useTokenSymbol } from "./tokenSymbol";

export const useWrappedNativeAddress =
  buildQueryHookWhenParamsDefinedChainAddrs<
    string,
    [_p1: "WrappedNative", _p2: "address"],
    []
  >(
    async params => {
      const contract = WETHGateway__factory.connect(
        params.chainAddrs.wrappedNativeGateway,
        params.library
      );
      return await contract.getWETHAddress();
    },
    () => ["WrappedNative", "address"],
    () => undefined,
    {
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );

export const useWrappedNativeDefinition =
  buildQueryHookWhenParamsDefinedChainAddrs<
    ReserveTokenDefinition,
    [_p1: "WrappedNative", _p2: "definition"],
    []
  >(
    async params => {
      const wrappedTokenAddress =
        await useWrappedNativeAddress.fetchQueryDefined(params);
      const wrapperTokenName = await useTokenSymbol.fetchQueryDefined(
        params,
        wrappedTokenAddress
      );
      const res: ReserveTokenDefinition = {
        symbol: wrapperTokenName,
        tokenAddress: wrappedTokenAddress,
      };
      return res;
    },
    () => ["WrappedNative", "definition"],
    () => undefined,
    {
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );

