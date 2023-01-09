import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { IStaticATokenLM__factory } from "../contracts";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { NATIVE_TOKEN, ReserveOrNativeTokenDefinition, selectReserveTokenAddress, useAllReserveTokens } from "./allReserveTokens";
import { internalAddressesPerNetwork } from "../utils/contracts/contractAddresses/internalAddresses";

export interface IAssets {}

const tokenBalance = buildQueryHookWhenParamsDefinedChainAddrs<
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

const allTokens = {
    data: [
        ['agWXDAI', internalAddressesPerNetwork.Gnosis.agWXDAI],
        ['agUSDT', internalAddressesPerNetwork.Gnosis.agUSDC],
        ['agUSDC', internalAddressesPerNetwork.Gnosis.agUSDC],
        ['agGNO', internalAddressesPerNetwork.Gnosis.agGNO],
        ['agWETH', internalAddressesPerNetwork.Gnosis.agWETH],
        ['agWBTC', internalAddressesPerNetwork.Gnosis.agWBTC],
        ['cagWXDAI', internalAddressesPerNetwork.Gnosis.cagWXDAI],
        ['cagUSDT', internalAddressesPerNetwork.Gnosis.cagUSDC],
        ['cagUSDC', internalAddressesPerNetwork.Gnosis.cagUSDC],
        ['cagGNO', internalAddressesPerNetwork.Gnosis.cagGNO],
        ['cagWETH', internalAddressesPerNetwork.Gnosis.cagWETH],
        ['cagWBTC', internalAddressesPerNetwork.Gnosis.cagWBTC],
    ]
}


export const userTokenBalances =
  buildQueryHookWhenParamsDefinedChainAddrs<
    { [key: string]: IAssets },
    [_p1: "user", _p2: "allDeposits", _p3: "balances", _p4: "dai"],
    []
  >(
    async params => {
      const [aTokens] = await Promise.all([
          Promise.all(
            allTokens.data.map((aToken:any) =>
                tokenBalance
                .fetchQueryDefined(params, aToken[1])
                .then(aTokenBalance => ({
                  balance: aTokenBalance,
                  name: aToken[0]
                }))
            )
          )
      ]);
    
      const tokenData: { [key: string]: IAssets } = {};
      for (const name in aTokens) {
        const at = aTokens[name];
        tokenData[at.name] = at.balance;
      }
      return tokenData;
    },
    () => ["user", "allDeposits", "balances", "dai"],
    () => undefined,
    {
      refetchOnMount: true,
      staleTime: 2 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
    }
  );