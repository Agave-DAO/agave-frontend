import React from "react";
import { BigNumber, FixedFormat, FixedNumber } from "@ethersproject/bignumber";
import { constants, ethers } from "ethers";
import { useProtocolReserveConfiguration } from "../queries/protocolAssetConfiguration";
import {
  useUserDepositAssetBalancesDaiWei,
  useUserVariableDebtTokenBalancesDaiWei,
} from "../queries/userAssets";
import {
  useAllReserveTokensWithConfiguration,
  ReserveTokensConfiguration,
} from "../queries/allReserveTokens";
import { FixedFromRay } from "../utils/fixedPoint";
import { weiPerToken } from "../queries/decimalsForToken";

export function useAllAssetsData() {
  const { data: reserveTokens } = useAllReserveTokensWithConfiguration();
  const { data: userDepositAssetBalancesDaiWei } =
    useUserDepositAssetBalancesDaiWei();
  const { data: userVariableDebtTokenBalancesDaiWei } =
    useUserVariableDebtTokenBalancesDaiWei();

  const assetsData = reserveTokens?.map((t: ReserveTokensConfiguration) => {
    const totalBorrowedForAsset = userVariableDebtTokenBalancesDaiWei?.find(
      ele => ele.tokenAddress === t.tokenAddress
    );

    const userDepositAsset = userDepositAssetBalancesDaiWei?.find(
      ele => ele.tokenAddress === t.tokenAddress
    );
    // HACK: Assumes values of roughly 0.1000 - 0.9999 in wei
    const ltv = t.rawltv;
    // HACK: Assumes values of roughly 1000 - 9999
    const liquidationThreshold = t.rawliquidationThreshold;

    const collateralBalance = userDepositAsset?.balance;
    const collateralValue = userDepositAsset?.daiWeiPriceTotal;
    const collateralBorrowCapacity =
      ltv && collateralValue ? ltv.mul(collateralValue).div(10000) : null;
    const collateralMaxCapacity =
      collateralValue && liquidationThreshold
        ? liquidationThreshold.mul(collateralValue).div(10000)
        : undefined;
    return {
      tokenConfig: t,
      aTokenAddress: userDepositAsset?.aTokenAddress,
      assetPrice: totalBorrowedForAsset?.daiWeiPricePer,
      collateralBalance: collateralBalance,
      collateralValue: collateralValue,
      collateralBorrowCapacity: collateralBorrowCapacity,
      collateralMaxCapacity: collateralMaxCapacity,
      borrowsValue: totalBorrowedForAsset?.daiWeiPriceTotal,
    };
  });

  return assetsData;
}

export function useNewHealthFactorByCollateralChange(
  amount: BigNumber | undefined,
  tokenAddress: string | undefined,
  deposit?: Boolean | false
) {
  const memoAmount = React.useMemo(() => amount, [amount]);
  const memoTokenAddress = React.useMemo(() => tokenAddress, [tokenAddress]);

  const assetsData = useAllAssetsData();

  const tokenData = assetsData
    ? assetsData.find(t => t.tokenConfig.tokenAddress === memoTokenAddress)
    : undefined;

  const newTotalBorrowsvalue = assetsData
    ? assetsData?.reduce((acc, next) => {
        return next.borrowsValue ? acc.add(next.borrowsValue) : acc;
      }, constants.Zero)
    : null;

  const oldTotalCollateralMaxCapacity = assetsData?.reduce((acc, next) => {
    return next.collateralMaxCapacity
      ? acc.add(next.collateralMaxCapacity)
      : acc;
  }, constants.Zero);

  const changeCollateralMaxCapacity =
    tokenData?.tokenConfig?.liquidationThreshold &&
    memoAmount &&
    memoAmount > constants.Zero
      ? tokenData.tokenConfig.rawliquidationThreshold.mul(memoAmount).div(10000)
      : constants.Zero;

  const newTotalCollateralMaxCapacity =
    changeCollateralMaxCapacity && oldTotalCollateralMaxCapacity
      ? deposit
        ? oldTotalCollateralMaxCapacity?.add(changeCollateralMaxCapacity)
        : oldTotalCollateralMaxCapacity?.sub(changeCollateralMaxCapacity)
      : undefined;
  // Multiply by 10^27 to be compatible with the Ray format and then converted into FixedNumber
  const newHealthFactor =
    newTotalBorrowsvalue &&
    !newTotalBorrowsvalue.isZero() &&
    newTotalCollateralMaxCapacity
      ? FixedFromRay(
          newTotalCollateralMaxCapacity
            .mul(BigNumber.from(10).pow(27))
            .div(newTotalBorrowsvalue)
        )
      : undefined;

  return newHealthFactor;
}

export function useNewHealthFactorByBorrowChange(
  amount: BigNumber | undefined,
  tokenAddress: string | undefined,
  borrow?: Boolean | false
) {
  const memoAmount = React.useMemo(() => amount, [amount]);
  const memoTokenAddress = React.useMemo(() => tokenAddress, [tokenAddress]);

  const assetsData = useAllAssetsData();

  const tokenData = assetsData
    ? assetsData.find(t => t.tokenConfig.tokenAddress === memoTokenAddress)
    : undefined;

  const oldTotalBorrowsvalue = assetsData
    ? assetsData?.reduce((acc, next) => {
        return next.borrowsValue ? acc.add(next.borrowsValue) : acc;
      }, constants.Zero)
    : null;

  const changeTotalBorrowsvalue =
    memoAmount &&
    tokenData &&
    tokenData.assetPrice &&
    memoAmount > constants.Zero
      ? memoAmount.mul(tokenData.assetPrice).div(weiPerToken(18))
      : constants.Zero;

  const newTotalBorrowsvalue =
    changeTotalBorrowsvalue && oldTotalBorrowsvalue
      ? borrow
        ? oldTotalBorrowsvalue?.add(changeTotalBorrowsvalue)
        : oldTotalBorrowsvalue?.sub(changeTotalBorrowsvalue)
      : undefined;

  const newTotalCollateralMaxCapacity = assetsData?.reduce((acc, next) => {
    return next.collateralMaxCapacity
      ? acc.add(next.collateralMaxCapacity)
      : acc;
  }, constants.Zero);
  // Multiply by 10^27 to be compatible with the Ray format and then converted into FixedNumber
  const newHealthFactor =
    newTotalBorrowsvalue &&
    !newTotalBorrowsvalue.isZero() &&
    newTotalCollateralMaxCapacity
      ? FixedFromRay(
          newTotalCollateralMaxCapacity
            .mul(BigNumber.from(10).pow(27))
            .div(newTotalBorrowsvalue)
        )
      : undefined;

  return newHealthFactor;
}
