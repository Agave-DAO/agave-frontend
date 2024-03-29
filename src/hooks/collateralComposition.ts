import React from "react";

import { BigNumber } from "@ethersproject/bignumber";
import {
  useUserReserveAssetBalancesDaiWei,
  ReserveAssetBalancesDaiWei,
  useUserDepositAssetBalancesDaiWei,
} from "../queries/userAssets";
import {
  useUserReservesData,
  UserReserveData,
} from "../queries/protocolReserveData";
import { constants } from "ethers";

// TODO: move to propertyCalculator in utils once that has been merged
function collateralCompositionCalculator(
  tokenAddresses: string[] | undefined,
  allUserReservesBalances: ReserveAssetBalancesDaiWei[] | undefined,
  allUserReservesData:
    | {
        [assetAddress: string]: UserReserveData;
      }
    | undefined
) {
  const totalCollateralValue = allUserReservesBalances?.reduce(
    (memo: BigNumber, next) =>
      next.daiWeiPriceTotal !== null &&
      allUserReservesData?.[next.tokenAddress].usageAsCollateralEnabled
        ? memo.add(next.daiWeiPriceTotal)
        : memo,
    constants.Zero
  );

  const compositionArray = allUserReservesBalances?.map(next => {
    const nextAddress = next.tokenAddress;
    const withCollateralEnabled =
      allUserReservesData && allUserReservesData?.[nextAddress]
        ? allUserReservesData?.[nextAddress].usageAsCollateralEnabled
        : undefined;
    if (
      next.daiWeiPriceTotal !== null &&
      next.decimals &&
      totalCollateralValue &&
      !totalCollateralValue.eq(constants.Zero) &&
      withCollateralEnabled
    ) {
      const decimalPower = BigNumber.from(10).pow(18);
      return next.daiWeiPriceTotal
        .mul(decimalPower)
        .mul(100)
        .div(totalCollateralValue);
    } else return constants.Zero;
  });

  const collateralComposition = compositionArray
    ? compositionArray.map(ratio => {
        if (ratio.gt(0)) {
          return ratio;
        } else return null;
      })
    : [];

  return collateralComposition;
}

export const useCollateralComposition = () => {
  const { data: allUserATokenBalances } = useUserDepositAssetBalancesDaiWei();

  const tokenAddresses = allUserATokenBalances?.map(token => {
    return token.tokenAddress;
  });

  const { data: allUserReservesData } = useUserReservesData(tokenAddresses);
  const collateralComposition = React.useMemo(
    () =>
      collateralCompositionCalculator(
        tokenAddresses,
        allUserATokenBalances,
        allUserReservesData
      ),
    [tokenAddresses, allUserATokenBalances, allUserReservesData]
  );

  return collateralComposition;
};
