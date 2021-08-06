import { AaveProtocolDataProvider__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { useProtocolReserveConfiguration, ReserveAssetConfiguration } from "./protocolAssetConfiguration";

export interface ReserveTokenDefinition {
  readonly symbol: string;
  readonly tokenAddress: string;
}

export const useAllReserveTokens = buildQueryHookWhenParamsDefinedChainAddrs<
  ReadonlyArray<ReserveTokenDefinition>,
  [_p1: "AaveProtocolDataProvider", _p2: "getAllReserveTokens"],
  []
>(
  async params => {
    const contract = AaveProtocolDataProvider__factory.connect(
      params.chainAddrs.aaveProtocolDataProvider,
      params.library.getSigner()
    );
    return await contract.getAllReservesTokens();
  },
  () => ["AaveProtocolDataProvider", "getAllReserveTokens"],
  () => undefined,
  {
    cacheTime: Infinity,
    staleTime: Infinity,
  }
);

export interface ReserveTokensConfiguration
  extends ReserveTokenDefinition,
    ReserveAssetConfiguration {}

export const useAllReserveTokensWithConfiguration =
  buildQueryHookWhenParamsDefinedChainAddrs<
    ReserveTokensConfiguration[],
    [_p1: "AaveProtocolDataProvider", _p2: "assetConfiguration"],
    []
  >(
    async params => {
      const allReserves = await useAllReserveTokens.fetchQueryDefined(params);

      const reservesWithData = await Promise.all(
        allReserves.map(reserve =>
          useProtocolReserveConfiguration
            .fetchQueryDefined(params, reserve.tokenAddress)
            .then(
              (data): ReserveTokensConfiguration => ({
                ...data,
                ...reserve,
              })
            )
        )
      );

      return reservesWithData;
    },
    () => ["AaveProtocolDataProvider", "assetConfiguration"],
    () => undefined,
    {
      cacheTime: 60 * 15 * 1000,
      staleTime: 60 * 5 * 1000,
    }
  );
