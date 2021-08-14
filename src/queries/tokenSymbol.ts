import { Erc20abi__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export const useTokenSymbol = buildQueryHookWhenParamsDefinedChainAddrs<
  string,
  [_p1: "asset", assetAddress: string | undefined, _p2: "symbol"],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const atoken = Erc20abi__factory.connect(assetAddress, params.library);
    return await atoken.symbol();
  },
  assetAddress => ["asset", assetAddress, "symbol"],
  () => undefined,
  {
    staleTime: 24 * 60 * 60 * 1000,
    cacheTime: 72 * 60 * 60 * 1000,
  }
);
