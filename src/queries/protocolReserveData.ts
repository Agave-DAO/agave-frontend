import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import {
  AaveProtocolDataProvider,
  AaveProtocolDataProvider__factory,
} from "../contracts";
import { PromisedType } from "../utils/promisedType";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

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

function rayFixed(input: BigNumber): FixedNumber {
  return FixedNumber.fromValue(input, 27);
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
    liquidityRate: rayFixed(liquidityRate),
    variableBorrowRate: rayFixed(variableBorrowRate),
    stableBorrowRate: rayFixed(stableBorrowRate),
    averageStableBorrowRate: rayFixed(averageStableBorrowRate),
    liquidityIndex: rayFixed(liquidityIndex),
    variableBorrowIndex: rayFixed(variableBorrowIndex),
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
      params.library.getSigner()
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
