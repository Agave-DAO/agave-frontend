import { BigNumber } from "@ethersproject/bignumber";
import { IStaticATokenLM__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { NATIVE_TOKEN, ReserveOrNativeTokenDefinition, selectReserveTokenAddress, useAllReserveTokens } from "./allReserveTokens";

export const useUserCagTokensBalance = buildQueryHookWhenParamsDefinedChainAddrs<
  BigNumber,
  [
    _p1: "user",
    _p2: "asset",
    assetOrAddress: string | NATIVE_TOKEN | undefined,
    _p3: "balance"
  ],
  [assetOrAddress: string | NATIVE_TOKEN | ReserveOrNativeTokenDefinition]
>(
  async (params, assetOrAddress) => {
    assetOrAddress = selectReserveTokenAddress(assetOrAddress);

    if (assetOrAddress === NATIVE_TOKEN) {
      return await params.library.getBalance(params.account);
    }
    const asset = IStaticATokenLM__factory.connect(assetOrAddress, params.library);

    return await asset.balanceOf(params.account);
  },
  assetOrAddress => [
    "user",
    "asset",
    selectReserveTokenAddress(assetOrAddress),
    "balance",
  ],
  () => undefined,
  {
    staleTime: 2 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  }
);
