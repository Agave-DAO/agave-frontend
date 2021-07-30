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
import { useTotalBorrowedForAsset } from "../queries/totalBorrowedForAsset";
import { ExtendedReserveTokenDefinition } from "../queries/lendingReserveData";
import { reserveConfigurationFromWeb3Result } from "../queries/protocolAssetConfiguration";
import Collateral from "../views/Collateral";
import { zeroLayout } from "framer-motion/types/render/utils/state";
import { formatEther } from "ethers/lib/utils";

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
      collateralBalance: userDepositAsset?.balance,
      collateralValue: userDepositAsset?.daiWeiPriceTotal,
      collateralBorrowCapacity: collateralBorrowCapacity,
      collateralMaxCapacity: collateralMaxCapacity,
      borrowsValue: totalBorrowedForAsset?.daiWeiPriceTotal,
    };
  });

  return assetsData;
}

export function useNewHealthFactorGivenDeposit(
  amount: BigNumber | undefined,
  tokenAddress: string | undefined
) {
  const memoAmount = React.useMemo(() => amount, [amount]);
  const memoTokenAddress = React.useMemo(() => tokenAddress, [tokenAddress]);

  const assetsData = useAllAssetsData();

  const tokenData = assetsData
    ? assetsData.find(t => t.tokenConfig.tokenAddress === memoTokenAddress)
    : undefined;

  const currentTotalBorrowsvalue = assetsData
    ? assetsData?.reduce((acc, next) => {
        return next.borrowsValue ? acc.add(next.borrowsValue) : acc;
      }, constants.Zero)
    : null;

  const currentTotalCollateralMaxCapacity = assetsData?.reduce((acc, next) => {
    return next.collateralMaxCapacity
      ? acc.add(next.collateralMaxCapacity)
      : acc;
  }, constants.Zero);

  const changeCollateralMaxCapacity =
    tokenData?.tokenConfig?.liquidationThreshold &&
    memoAmount &&
    memoAmount > constants.Zero
      ? tokenData.tokenConfig.rawliquidationThreshold.mul(memoAmount).div(10000)
      : null;

  const newTotalCollateralMaxCapacity =
    changeCollateralMaxCapacity && changeCollateralMaxCapacity !== null
      ? currentTotalCollateralMaxCapacity?.add(changeCollateralMaxCapacity)
      : null;

  const newHealthFactor =
    currentTotalBorrowsvalue && newTotalCollateralMaxCapacity
      ? newTotalCollateralMaxCapacity
          .mul(1000000000)
          .div(currentTotalBorrowsvalue)
      : null;

  console.log({
    pBorrow: currentTotalBorrowsvalue?.toString(),
    pMax: currentTotalCollateralMaxCapacity?.toString(),
    cMax: changeCollateralMaxCapacity?.toString(),
    nMax: newTotalCollateralMaxCapacity?.toString(),
    hf: newHealthFactor?.toString(),
  });

  return newHealthFactor;
}
