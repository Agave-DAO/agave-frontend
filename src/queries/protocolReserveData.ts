import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import {
  AaveProtocolDataProvider,
  AaveProtocolDataProvider__factory,
} from "../contracts";
import { PromisedType } from "../utils/promisedType";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";
import { FixedFromRay } from "../utils/fixedPoint";

export interface ProtocolReserveData {
  // ERC20(LendingPoolReserveData.aTokenAddress).balanceOf(reserve.aTokenAddress)
  availableLiquidity: BigNumber;
  // ERC20(reserve.stableDebtTokenAddress).totalSupply()
  totalStableDebt: BigNumber;
  // ERC20(reserve.variableDebtTokenAddress).totalSupply()
  totalVariableDebt: BigNumber;
  // The current supply liquidity rate. Expressed in ray
  liquidityRate: FixedNumber;
  //the current variable borrow rate. Expressed in ray
  variableBorrowRate: FixedNumber;
  //the current stable borrow rate. Expressed in ray
  stableBorrowRate: FixedNumber;
  // IStableDebtToken(reserve.stableDebtTokenAddress).getAverageStableRate()
  averageStableBorrowRate: FixedNumber;
  //the liquidity index. Expressed in ray
  liquidityIndex: FixedNumber;
  //variable borrow index. Expressed in ray
  variableBorrowIndex: FixedNumber;
  // Timestamp of the last update to this reserve
  lastUpdateTimestamp: number;
}

export function reserveDataFromWeb3Result({
  availableLiquidity,
  totalStableDebt,
  totalVariableDebt,
  liquidityRate, // ray
  variableBorrowRate, // ray
  stableBorrowRate, // ray
  averageStableBorrowRate, // ray
  liquidityIndex, // ray
  variableBorrowIndex, // ray
  lastUpdateTimestamp,
}: Web3ProtocolReserveDataResult): ProtocolReserveData {
  return {
    availableLiquidity,
    totalStableDebt,
    totalVariableDebt,
    liquidityRate: FixedFromRay(liquidityRate),
    variableBorrowRate: FixedFromRay(variableBorrowRate),
    stableBorrowRate: FixedFromRay(stableBorrowRate),
    averageStableBorrowRate: FixedFromRay(averageStableBorrowRate),
    liquidityIndex: FixedFromRay(liquidityIndex),
    variableBorrowIndex: FixedFromRay(variableBorrowIndex),
    lastUpdateTimestamp,
  };
}

type Web3ProtocolReserveDataResult = PromisedType<
  ReturnType<typeof AaveProtocolDataProvider.prototype.getReserveData>
>;

export const useProtocolReserveData = buildQueryHookWhenParamsDefinedChainAddrs<
  ProtocolReserveData,
  [
    _p1: "AaveProtocolDataProvider",
    _p2: "reserveData",
    assetAddress: string | undefined
  ],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const contract = AaveProtocolDataProvider__factory.connect(
      params.chainAddrs.aaveProtocolDataProvider,
      params.library
    );
    return await contract
      .getReserveData(assetAddress)
      .then(reserveData => reserveDataFromWeb3Result(reserveData));
  },
  assetAddress => ["AaveProtocolDataProvider", "reserveData", assetAddress],
  () => undefined,
  {
    cacheTime: 60 * 15 * 1000,
    staleTime: 60 * 5 * 1000,
  }
);

export interface UserReserveData {
  // ERC20(LendingPoolReserveData.aTokenAddress).balanceOf(user)
  currentATokenBalance: BigNumber;
  // ERC20(reserve.stableDebtTokenAddress).balanceOf(user)
  currentStableDebt: BigNumber;
  // ERC20(reserve.variableDebtTokenAddress).balanceOf(user)
  currentVariableDebt: BigNumber;
  // The principal stable debt of the user
  principalStableDebt: BigNumber;
  // Scaled variable debt of the user
  scaledVariableDebt: BigNumber;
  // The stable borrow rate of the user (expressed in ray)
  stableBorrowRate: FixedNumber;
  // The interest rate being earned by the user for deposits (expressed in ray)
  liquidityRate: FixedNumber;
  // The last time the stable rate was updated for this reserve
  stableRateLastUpdated: number;
  // Whether or not this reserve can be used as collateral
  usageAsCollateralEnabled: boolean;
}

export function userReserveDataFromWeb3Result({
  currentATokenBalance,
  currentStableDebt,
  currentVariableDebt,
  principalStableDebt,
  scaledVariableDebt,
  stableBorrowRate, // ray
  liquidityRate, // ray
  stableRateLastUpdated,
  usageAsCollateralEnabled,
}: Web3ProtocolUserReserveDataResult): UserReserveData {
  return {
    currentATokenBalance,
    currentStableDebt,
    currentVariableDebt,
    principalStableDebt,
    scaledVariableDebt,
    stableBorrowRate: FixedFromRay(stableBorrowRate),
    liquidityRate: FixedFromRay(liquidityRate),
    stableRateLastUpdated,
    usageAsCollateralEnabled,
  };
}

type Web3ProtocolUserReserveDataResult = PromisedType<
  ReturnType<typeof AaveProtocolDataProvider.prototype.getUserReserveData>
>;

export const useUserReserveData = buildQueryHookWhenParamsDefinedChainAddrs<
  UserReserveData,
  [_p1: "user", _p2: "reserveData", assetAddress: string | undefined],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const contract = AaveProtocolDataProvider__factory.connect(
      params.chainAddrs.aaveProtocolDataProvider,
      params.library.getSigner()
    );
    return await contract
      .getUserReserveData(assetAddress, params.account)
      .then(userReserveData => userReserveDataFromWeb3Result(userReserveData));
  },
  assetAddress => ["user", "reserveData", assetAddress],
  () => undefined,
  {
    cacheTime: 60 * 15 * 1000,
    staleTime: 60 * 5 * 1000,
  }
);

export const useUserReservesData = buildQueryHookWhenParamsDefinedChainAddrs<
  { [assetAddress: string]: UserReserveData },
  [_p1: "user", _p2: "reserveData", assetAddresses: string[] | undefined],
  [assetAddresses: string[]]
>(
  async (params, assetAddresses) => {
    const reserveData = await Promise.all(
      assetAddresses.map(assetAddress =>
        useUserReserveData
          .fetchQueryDefined(params, assetAddress)
          .then(result => [assetAddress, result])
      )
    );
    return Object.fromEntries(reserveData);
  },
  assetAddresses => ["user", "reserveData", assetAddresses],
  () => undefined,
  {
    cacheTime: 60 * 15 * 1000,
    staleTime: 60 * 5 * 1000,
  }
);
