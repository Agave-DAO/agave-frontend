import React from "react";
import { BigNumber, FixedFormat, FixedNumber } from "@ethersproject/bignumber";
import { constants, ethers } from "ethers";
import { useProtocolReserveConfiguration } from "../queries/protocolAssetConfiguration";
import {
  useUserDepositAssetBalancesDaiWei,
  useUserVariableDebtTokenBalancesDaiWei,
  VariableDebtTokenBalancesDaiWei,
} from "../queries/userAssets";
import {
  useAllReserveTokensWithConfiguration,
  ReserveTokensConfiguration,
} from "../queries/allReserveTokens";
import { FixedFromRay } from "../utils/fixedPoint";
import { weiPerToken } from "../queries/decimalsForToken";

interface AssetsData {
  tokenConfig: ReserveTokensConfiguration;
  aTokenAddress: string | undefined;
  assetPrice: BigNumber | null;
  collateralBalance: BigNumber | null;
  collateralValue: BigNumber | null;
  collateralBorrowCapacity: BigNumber | null;
  collateralMaxCapacity: BigNumber | null;
  borrowsValue: BigNumber | null;
}

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
    // HACK: Assumes values of roughly 1000 - 9999
    const ltv = t.rawltv;
    // HACK: Assumes values of roughly 1000 - 9999
    const liquidationThreshold = t.rawliquidationThreshold;

    const pricePer = totalBorrowedForAsset
      ? totalBorrowedForAsset.daiWeiPricePer
      : null;

    const collateralBalance = userDepositAsset
      ? userDepositAsset.balance
      : null;
    const collateralValue = userDepositAsset
      ? userDepositAsset.daiWeiPriceTotal
      : null;
    const collateralBorrowCapacity =
      ltv && collateralValue ? ltv.mul(collateralValue).div(10000) : null;

    const collateralMaxCapacity =
      collateralValue && liquidationThreshold
        ? liquidationThreshold.mul(collateralValue).div(10000)
        : null;
    const totalBorrowsValue = totalBorrowedForAsset
      ? totalBorrowedForAsset.daiWeiPriceTotal
      : null;
    return {
      tokenConfig: t,
      aTokenAddress: userDepositAsset?.aTokenAddress,
      assetPrice: pricePer,
      collateralBalance: collateralBalance,
      collateralValue: collateralValue,
      collateralBorrowCapacity: collateralBorrowCapacity,
      collateralMaxCapacity: collateralMaxCapacity,
      borrowsValue: totalBorrowsValue,
    };
  });

  return assetsData;
}

function newHealthFactorGivenAssetsData(
  amount: BigNumber | undefined,
  tokenAddress: string,
  assetsData: AssetsData[] | undefined,
  collateral: Boolean,
  increase?: Boolean | false
) {
  const tokenData = assetsData
    ? assetsData.find(t => t.tokenConfig.tokenAddress === tokenAddress)
    : undefined;

  const oldTotalCollateralMaxCapacity = assetsData?.reduce((acc, next) => {
    return next.collateralMaxCapacity
      ? acc.add(next.collateralMaxCapacity)
      : acc;
  }, constants.Zero);

  // Collateral Calculations

  const changeCollateralMaxCapacity =
    tokenData &&
    tokenData.tokenConfig.rawliquidationThreshold &&
    amount &&
    collateral &&
    amount > constants.Zero
      ? tokenData.tokenConfig.rawliquidationThreshold.mul(amount).div(10000)
      : constants.Zero;

  const newTotalCollateralMaxCapacity =
    changeCollateralMaxCapacity && oldTotalCollateralMaxCapacity
      ? increase
        ? oldTotalCollateralMaxCapacity.add(changeCollateralMaxCapacity)
        : oldTotalCollateralMaxCapacity.sub(changeCollateralMaxCapacity)
      : undefined;

  // Borrow Calculations
  const oldTotalBorrowsvalue = assetsData
    ? assetsData?.reduce((acc, next) => {
        return next.borrowsValue ? acc.add(next.borrowsValue) : acc;
      }, constants.Zero)
    : null;

  const changeTotalBorrowsvalue =
    amount &&
    !collateral &&
    tokenData &&
    tokenData.assetPrice &&
    amount > constants.Zero
      ? amount.mul(tokenData.assetPrice).div(weiPerToken(18))
      : constants.Zero;

  const newTotalBorrowsvalue =
    changeTotalBorrowsvalue && oldTotalBorrowsvalue
      ? increase
        ? oldTotalBorrowsvalue.add(changeTotalBorrowsvalue)
        : oldTotalBorrowsvalue.sub(changeTotalBorrowsvalue)
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

export function useNewHealthFactorCalculator(
  amount: BigNumber | undefined,
  tokenAddress: string,
  collateral: Boolean,
  increase?: Boolean | false
) {
  //const amount = React.useMemo(() => amount, [amount]);
  const assetsData = useAllAssetsData();

  const newHealthFactor = React.useMemo(
    () =>
      newHealthFactorGivenAssetsData(
        amount,
        tokenAddress,
        assetsData,
        collateral,
        increase
      ),
    [amount, tokenAddress, assetsData, collateral, increase]
  );

  return newHealthFactor;
}
