import React from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { constants } from "ethers";
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
  tokenAddress: string | undefined,
  assetsData: AssetsData[] | undefined,
  collateral: Boolean,
  increase?: Boolean | false
) {
  const tokenData =
    tokenAddress !== undefined && assetsData
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
    tokenData.assetPrice &&
    amount &&
    collateral &&
    amount > constants.Zero
      ? tokenData.tokenConfig.rawliquidationThreshold
          .mul(amount)
          .mul(tokenData.assetPrice)
          .div(weiPerToken(tokenData?.tokenConfig.decimals.add(4)))
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
      ? amount
          .mul(tokenData.assetPrice)
          .div(weiPerToken(tokenData?.tokenConfig.decimals))
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
  tokenAddress: string | undefined,
  collateral: Boolean,
  increase?: Boolean
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

export function useMaxChangeGivenHealthFactor(
  amount: BigNumber | undefined,
  tokenAddress: string | undefined,
  mode: "repay" | "deposit" | "withdraw" | "borrow",
  targetValue: BigNumber
) {
  const assetsData = useAllAssetsData();
  if (mode !== "withdraw" && mode !== "borrow") {
    return amount;
  }
  if (mode === "withdraw" || mode === "borrow") {
    const collateral = mode === "withdraw" ? true : false;
    const tokenData =
      tokenAddress !== undefined && assetsData
        ? assetsData.find(t => t.tokenConfig.tokenAddress === tokenAddress)
        : undefined;

    const oldTotalCollateralMaxCapacity = assetsData?.reduce((acc, next) => {
      return next.collateralMaxCapacity
        ? acc.add(next.collateralMaxCapacity)
        : acc;
    }, constants.Zero);

    const oldTotalBorrowsvalue = assetsData?.reduce((acc, next) => {
      return next.borrowsValue ? acc.add(next.borrowsValue) : acc;
    }, constants.Zero);

    let maxAmountLimit = amount;

    if (!collateral && tokenData && amount && oldTotalBorrowsvalue) {
      const newTBV = oldTotalCollateralMaxCapacity
        ? oldTotalCollateralMaxCapacity.mul(1000).div(targetValue)
        : amount;

      const deltaTBV =
        oldTotalCollateralMaxCapacity && newTBV
          ? newTBV.sub(oldTotalBorrowsvalue)
          : constants.Zero;

      maxAmountLimit =
        deltaTBV && tokenData.tokenConfig.decimals && tokenData.assetPrice
          ? deltaTBV
              .mul(weiPerToken(tokenData?.tokenConfig.decimals))
              .div(tokenData.assetPrice)
          : amount;
    } else if (
      collateral &&
      tokenData &&
      amount &&
      oldTotalCollateralMaxCapacity
    ) {
      const newTCMC = oldTotalBorrowsvalue
        ? oldTotalBorrowsvalue.mul(targetValue).div(1000)
        : undefined;

      const deltaTCMC =
        oldTotalCollateralMaxCapacity && newTCMC
          ? oldTotalCollateralMaxCapacity.sub(newTCMC)
          : constants.Zero;

      maxAmountLimit =
        deltaTCMC && tokenData.tokenConfig.decimals && tokenData.assetPrice
          ? deltaTCMC
              .mul(weiPerToken(tokenData?.tokenConfig.decimals.add(4)))
              .div(
                tokenData.tokenConfig.rawliquidationThreshold.mul(
                  tokenData.assetPrice
                )
              )
          : amount;
    }
    return maxAmountLimit;
  }
}
