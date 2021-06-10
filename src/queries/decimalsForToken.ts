import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { Erc20abi__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export function weiPerToken(decimals: BigNumberish): BigNumber {
  return BigNumber.from(10).pow(decimals);
}

export const useDecimalCountForToken =
  buildQueryHookWhenParamsDefinedChainAddrs<
    number,
    [_p1: "erc20", assetAddress: string | undefined, _p2: "decimals"],
    [assetAddress: string]
  >(
    async (params, assetAddress) => {
      const contract = Erc20abi__factory.connect(
        assetAddress,
        params.library.getSigner()
      );
      return contract.decimals();
    },
    assetAddress => ["erc20", assetAddress, "decimals"],
    () => undefined,
    {
      staleTime: 60 * 60 * 24 * 1000,
      cacheTime: 60 * 60 * 24 * 1000,
    }
  );
