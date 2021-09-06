import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import { AgaveLendingABI, AgaveLendingABI__factory } from "../contracts";
import { divIfNotZeroUnsafe } from "../utils/fixedPoint";
import { PromisedType } from "../utils/promisedType";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { ReserveOrNativeTokenDefinition } from "./allReserveTokens";
import { useAssetPriceInDaiWei } from "./assetPriceInDai";
import { useDecimalCountForToken, weiPerToken } from "./decimalsForToken";

export interface UserAccountData {
  // TODO: Is this actually in "native" tokens?
  totalCollateralEth: BigNumber; // e.g. 195776830917421 in wei
  totalDebtEth: BigNumber; // e.g. 91611984393903 in wei
  availableBorrowsEth: BigNumber; // e.g. 21566601559458 in wei
  currentLiquidationThreshold: FixedNumber; //  Fixed4 e.g. 7021 = 70.21%
  maximumLtv: FixedNumber; //  Fixed4 e.g. 5781 = 57.81 MaximumLTV
  maximumLtvDiscrete: BigNumber; //  Fixed4 e.g. 5781 = 57.81 MaximumLTV
  currentLtv: FixedNumber; // 0 <-> Math.min(maximumLtv, 1), totalDebt / totalCollateral
  usedBorrowingPower: FixedNumber;
  healthFactor: BigNumber; //  e.g. 2500000000000000000 in wei
}

export function userAccountDataFromWeb3Result({
  totalCollateralETH, // e.g. 195776830917421 in wei
  totalDebtETH, // e.g. 91611984393903 in wei
  availableBorrowsETH, // e.g. 21566601559458 in wei
  currentLiquidationThreshold, //  Fixed4 e.g. 7021 = 70.21%
  ltv, //  Fixed4 e.g. 5781 = 57.81 MaximumLTV
  healthFactor, //  Ray e.g. 1500403183017056862 = 1.50
}: Web3UserAccountData): UserAccountData {
  const maximumLtv = FixedNumber.fromValue(ltv, 4);
  const currentLtv = divIfNotZeroUnsafe(
    FixedNumber.fromValue(totalDebtETH, 18),
    FixedNumber.fromValue(totalCollateralETH, 18)
  );
  return {
    totalCollateralEth: totalCollateralETH,
    totalDebtEth: totalDebtETH,
    availableBorrowsEth: availableBorrowsETH,
    currentLiquidationThreshold: FixedNumber.fromValue(
      currentLiquidationThreshold,
      4
    ),
    maximumLtvDiscrete: ltv,
    maximumLtv,
    currentLtv,
    usedBorrowingPower: divIfNotZeroUnsafe(currentLtv, maximumLtv),
    healthFactor,
  };
}

type Web3UserAccountData = PromisedType<
  ReturnType<typeof AgaveLendingABI.prototype.getUserAccountData>
>;

export const useUserAccountData = buildQueryHookWhenParamsDefinedChainAddrs<
  UserAccountData,
  [
    _p1: "LendingPool",
    _p2: "userAccountData",
    accountAddress: string | undefined
  ],
  [accountAddress: string]
>(
  async (params, accountAddress) => {
    const contract = AgaveLendingABI__factory.connect(
      params.chainAddrs.lendingPool,
      params.library
    );
    return await contract
      .getUserAccountData(accountAddress)
      .then(userAccountDataFromWeb3Result);
  },
  accountAddress => ["LendingPool", "userAccountData", accountAddress],
  () => undefined,
  {
    cacheTime: 60 * 15 * 1000,
    staleTime: 60 * 5 * 1000,
  }
);

export const useAvailableToBorrowAssetWei =
  buildQueryHookWhenParamsDefinedChainAddrs<
    BigNumber | null,
    [
      _p1: "LendingPool",
      _p2: "userAccountData",
      accountAddress: string | undefined,
      _p3: "availableToBorrow",
      assetAddress: ReserveOrNativeTokenDefinition | undefined
    ],
    [accountAddress: string, assetAddress: ReserveOrNativeTokenDefinition]
  >(
    async (params, accountAddress, assetAddress) => {
      const [accountData, assetPrice, assetDecimals] = await Promise.all([
        useUserAccountData.fetchQueryDefined(params, accountAddress),
        useAssetPriceInDaiWei.fetchQueryDefined(params, assetAddress),
        useDecimalCountForToken.fetchQueryDefined(params, assetAddress),
      ]);

      return assetPrice
        ? accountData.availableBorrowsEth
            .mul(weiPerToken(assetDecimals))
            .div(assetPrice)
        : null;
    },
    (accountAddress, assetAddress) => [
      "LendingPool",
      "userAccountData",
      accountAddress,
      "availableToBorrow",
      assetAddress,
    ],
    () => undefined,
    {
      cacheTime: 60 * 15 * 1000,
      staleTime: 60 * 5 * 1000,
    }
  );
