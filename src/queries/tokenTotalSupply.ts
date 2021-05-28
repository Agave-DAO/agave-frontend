import { BigNumber } from "@ethersproject/bignumber";
import { Erc20abi__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export const useTokenTotalSupply = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [_p1: "asset", assetAddress: string | undefined, _p2: "totalSupply"],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const atoken = Erc20abi__factory.connect(
      assetAddress,
      params.library.getSigner()
    );
    return await atoken.totalSupply();
  },
  assetAddress => ["asset", assetAddress, "totalSupply"],
  () => undefined,
  {
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  }
);
