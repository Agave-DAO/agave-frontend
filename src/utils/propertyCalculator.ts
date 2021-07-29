import React from "react";
import { BigNumber, FixedFormat, FixedNumber } from "@ethersproject/bignumber";
import { constants, ethers } from "ethers";
import { useProtocolReserveConfiguration } from "../queries/protocolAssetConfiguration";
import { useUserDepositAssetBalancesDaiWei } from "../queries/userAssets";
import { useTotalBorrowedForAsset } from "../queries/totalBorrowedForAsset";
import {
  useAllReserveTokens,
  ReserveTokenDefinition,
} from "../queries/allReserveTokens";
import Collateral from "../views/Collateral";
import { zeroLayout } from "framer-motion/types/render/utils/state";

export function getAssetsData() {
  const { data: reserveTokens } = useAllReserveTokens();
  const { data: userDepositAssetBalancesDaiWei } =
    useUserDepositAssetBalancesDaiWei();

  const assetsData = reserveTokens?.map((t: ReserveTokenDefinition) => {
    const { data: reserveAssetConfiguration } = useProtocolReserveConfiguration(
      t.tokenAddress
    );
    const totalBorrowedForAsset = reserveAssetConfiguration?.borrowingEnabled
      ? useTotalBorrowedForAsset(t.tokenAddress)
      : null;

    const userDepositAsset = userDepositAssetBalancesDaiWei?.find(
      ele => ele.tokenAddress === t.tokenAddress
    );

    const ltv = reserveAssetConfiguration?.ltv.toUnsafeFloat();
    const liquidationThreshold =
      reserveAssetConfiguration?.liquidationThreshold.toUnsafeFloat();
    const collateralBalance = userDepositAsset?.balance;
    const collateralValue = userDepositAsset?.daiWeiPriceTotal;
    const collateralBorrowCapacity =
      ltv && collateralValue
        ? collateralValue.mul(BigNumber.from(ltv * 1000).div(1000))
        : null;
    const collateralMaxCapacity =
      collateralValue && liquidationThreshold
        ? collateralValue.mul(
            BigNumber.from(liquidationThreshold * 1000).div(1000)
          )
        : null;

    return {
      tokenAddress: t.tokenAddress,
      aTokenAddress: userDepositAsset?.aTokenAddress,
      assetConfig: reserveAssetConfiguration,
      collateralBalance: userDepositAsset?.balance,
      collateralValue: userDepositAsset?.daiWeiPriceTotal,
      collateralBorrowCapacity: collateralBorrowCapacity,
      collateralMaxCapacity: collateralMaxCapacity,
      borrowsValue: totalBorrowedForAsset?.data?.wei,
    };
  });

  return assetsData;
}

export function newHealthFactorGivenDeposit({
  amount,
  tokenAddress,
}: {
  amount: BigNumber;
  tokenAddress: string;
}) {
  const memoAmount = React.useMemo(() => amount, [amount]);
  const memoTokenAddress = React.useMemo(() => tokenAddress, [tokenAddress]);

  const assetsData = getAssetsData();

  const tokenData = assetsData
    ? assetsData.find(t => t.tokenAddress === memoTokenAddress)
    : undefined;

  const currentTotalBorrowsvalue = assetsData?.reduce((acc, next) => {
    return next.borrowsValue ? acc.add(next.borrowsValue) : acc;
  }, constants.Zero);

  const currentTotalCollateralMaxCapacity = assetsData?.reduce((acc, next) => {
    return next.collateralMaxCapacity
      ? acc.add(next.collateralMaxCapacity)
      : acc;
  }, constants.Zero);

  const changeCollateralMaxCapacity =
    tokenData?.assetConfig?.liquidationThreshold !== undefined
      ? memoAmount.mul(
          BigNumber.from(
            tokenData.assetConfig.liquidationThreshold.toUnsafeFloat() * 1000
          ).div(1000)
        )
      : null;

  const newTotalCollateralMaxCapacity =
    changeCollateralMaxCapacity !== null
      ? currentTotalCollateralMaxCapacity?.add(changeCollateralMaxCapacity)
      : null;

  const newHealthFactor =
    currentTotalBorrowsvalue && newTotalCollateralMaxCapacity
      ? newTotalCollateralMaxCapacity?.div(currentTotalBorrowsvalue)
      : null;

  return newHealthFactor;
}
