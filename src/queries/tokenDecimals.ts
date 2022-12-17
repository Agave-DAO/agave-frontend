import { Erc20abi__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export const tokenDecimals = buildQueryHookWhenParamsDefinedChainAddrs<
  number,
  [_p1: "asset", assetAddress: string | undefined, _p2: "decimals"],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const atoken = Erc20abi__factory.connect(assetAddress, params.library);
    return await atoken.decimals();
  },
  assetAddress => ["asset", assetAddress, "decimals"],
  () => undefined,
  {
    staleTime: 24 * 60 * 60 * 1000,
    cacheTime: 72 * 60 * 60 * 1000,
  }
);
