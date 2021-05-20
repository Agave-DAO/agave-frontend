import { AaveProtocolDataProvider__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export interface ATokenDefinition {
  readonly symbol: string;
  readonly tokenAddress: string;
}

export const useAllATokens =
  buildQueryHookWhenParamsDefinedChainAddrs<
    ReadonlyArray<ATokenDefinition>,
    [_p1: "AaveProtocolDataProvider", _p2: "getAllATokens"],
    []
  >(
    async params => {
      const contract = AaveProtocolDataProvider__factory.connect(
        params.chainAddrs.aaveProtocolDataProvider,
        params.library.getSigner()
      );
      return await contract.getAllATokens();
    },
    () => ["AaveProtocolDataProvider", "getAllATokens"],
    () => undefined
  );
