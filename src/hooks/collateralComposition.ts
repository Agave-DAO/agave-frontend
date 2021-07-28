import React from "react";

import { BigNumber } from "@ethersproject/bignumber";
import { useUserReserveAssetBalancesDaiWei } from "../queries/userAssets";
import { useUserReservesData } from "../queries/protocolReserveData";
import { constants } from "ethers";
import { ConsoleView } from "react-device-detect";

export const useCollateralComposition = () => {
  const { data: allUserReservesBalances } = useUserReserveAssetBalancesDaiWei();

  const tokenAddresses = allUserReservesBalances?.map(token => {
    return token.tokenAddress;
  });

  const { data: allUserReservesData } = useUserReservesData(tokenAddresses);

  const totalCollateralValue = allUserReservesBalances?.reduce(
    (memo: BigNumber, next) =>
      next.daiWeiPriceTotal !== null ? memo.add(next.daiWeiPriceTotal) : memo,
    constants.Zero
  );

  const compositionArray = allUserReservesBalances?.map(next => {
    const withCollateralEnabled =
      allUserReservesData?.[next.tokenAddress]?.usageAsCollateralEnabled;
    if (
      next.daiWeiPriceTotal !== null &&
      next.decimals &&
      totalCollateralValue &&
      !totalCollateralValue.eq(constants.Zero) &&
      withCollateralEnabled
    ) {
      const decimalPower = BigNumber.from(10).pow(next.decimals);
      return next.daiWeiPriceTotal.mul(decimalPower).div(totalCollateralValue);
    } else return constants.Zero;
  });

  const collateralComposition = compositionArray
    ? compositionArray.map(ratio => {
        if (ratio.gt(0)) {
          return ratio.mul(100);
        } else return null;
      })
    : [];

  return collateralComposition;
};
