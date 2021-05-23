import { BigNumber } from "@ethersproject/bignumber";
import { constants } from "ethers";
import { AaveOracle__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

type Tail<T extends [unknown, ...unknown[]]> = T extends [unknown, ...infer X]
  ? [...X]
  : never;

export const useAssetPriceInDaiWei = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [_p1: "prices", _p2: "dai", _p3: "asset", assetAddress: string | undefined],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const contract = AaveOracle__factory.connect(
      params.chainAddrs.agaveOracle,
      params.library.getSigner()
    );
    return await contract.getAssetPrice(assetAddress); // price in dai per token
  },
  assetAddress => ["prices", "dai", "asset", assetAddress],
  () => undefined
);

// Mappers apply *after* the cache, so we can reuse the same cache and invocation when mapping
export const useAssetPriceInDai = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  // A trick to compensate for buildKey including chainId and account
  Tail<Tail<ReturnType<typeof useAssetPriceInDaiWei.buildKey>>>,
  [assetAddress: string]
>(
  useAssetPriceInDaiWei.invokeWhenDefined,
  // HACK: make a buildKey utility on queryBuilder that doesn't include chainId and account
  (...args) => {
    const [, , ...res] = useAssetPriceInDaiWei.buildKey(
      undefined,
      undefined,
      ...args
    );
    return [...res];
  },
  () => undefined,
  undefined,
  res => res.div(constants.WeiPerEther)
);

export const useAssetPricesInDaiWei = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber[],
  [
    _p1: "prices",
    _p2: "dai",
    _p3: "assets",
    assetAddresses: string[] | undefined
  ],
  [assetAddresses: string[]]
>(
  async (params, assetAddresses) => {
    const contract = AaveOracle__factory.connect(
      params.chainAddrs.agaveOracle,
      params.library.getSigner()
    );
    return await contract.getAssetsPrices(assetAddresses); // price in dai per token
  },
  assetAddresses => ["prices", "dai", "assets", assetAddresses],
  () => undefined
);
