import { AaveProtocolDataProvider__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export interface ReserveTokenDefinition {
  readonly symbol: string;
  readonly tokenAddress: string;
}

export const useAllReserveTokens =
  buildQueryHookWhenParamsDefinedChainAddrs<
    ReadonlyArray<ReserveTokenDefinition>,
    [_p1: "AaveProtocolDataProvider", _p2: "getAllReserveTokens"],
    []
  >(
    async params => {
      const contract = AaveProtocolDataProvider__factory.connect(
        params.chainAddrs.aaveProtocolDataProvider,
        params.library.getSigner()
      );
      return await contract.getAllATokens();
    },
    () => ["AaveProtocolDataProvider", "getAllReserveTokens"],
    () => undefined,
    {
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );
