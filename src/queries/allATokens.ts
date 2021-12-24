import { AaveProtocolDataProvider__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { useAllReserveTokens } from "./allReserveTokens";

export interface ATokenDefinition {
  readonly symbol: string;
  readonly tokenAddress: string;
}

export interface ProtocolAddresses {
  readonly aTokenAddress: string;
  readonly stableDebtTokenAddress: string;
  readonly variableDebtTokenAddress: string;
}

export const useAllATokens = buildQueryHookWhenParamsDefinedChainAddrs<
  ReadonlyArray<ATokenDefinition>,
  [_p1: "AaveProtocolDataProvider", _p2: "getAllATokens"],
  []
>(
  async params => {
    const contract = AaveProtocolDataProvider__factory.connect(
      params.chainAddrs.aaveProtocolDataProvider,
      params.library
    );
    return await contract.getAllATokens();
  },
  () => ["AaveProtocolDataProvider", "getAllATokens"],
  () => undefined,
  {
    cacheTime: Infinity,
    staleTime: Infinity,
  }
);

export const useAllProtocolTokens = buildQueryHookWhenParamsDefinedChainAddrs<
  ReadonlyArray<ProtocolAddresses>,
  [_p1: "AaveProtocolDataProvider", _p2: "getAllProtocolTokens"],
  []
>(
  async params => {
    const contract = AaveProtocolDataProvider__factory.connect(
      params.chainAddrs.aaveProtocolDataProvider,
      params.library
    );
    const reserves = await useAllReserveTokens.fetchQueryDefined(params);

    let protocolAddresses: ProtocolAddresses[] = [];

    for (let i = 0; i < reserves.length; i++) {
      protocolAddresses.push(
        await contract.getReserveTokensAddresses(reserves[i].tokenAddress)
      );
    }
    return protocolAddresses;
  },
  () => ["AaveProtocolDataProvider", "getAllProtocolTokens"],
  () => undefined,
  {
    cacheTime: Infinity,
    staleTime: Infinity,
  }
);
