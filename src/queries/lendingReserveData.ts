import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import { AgaveLendingABI, AgaveLendingABI__factory } from "../contracts";
import { PromisedType } from "../utils/promisedType";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export interface LendingReserveData {
  //stores the reserve configuration
  configuration: [BigNumber & ReserveConfigurationMap] & { data: BigNumber };
  //the liquidity index. Expressed in ray
  liquidityIndex: FixedNumber;
  //variable borrow index. Expressed in ray
  variableBorrowIndex: FixedNumber;
  //the current supply rate. Expressed in ray
  currentLiquidityRate: FixedNumber;
  //the current variable borrow rate. Expressed in ray
  currentVariableBorrowRate: FixedNumber;
  //the current stable borrow rate. Expressed in ray
  currentStableBorrowRate: FixedNumber;
  lastUpdateTimestamp: number;
  //tokens addresses
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
  //address of the interest rate strategy
  interestRateStrategyAddress: string;
  //the id of the reserve. Represents the position in the list of the active reserves
  id: number;
}

//bit 0-15: LTV
//bit 16-31: Liq. threshold
//bit 32-47: Liq. bonus
//bit 48-55: Decimals
//bit 56: Reserve is active
//bit 57: reserve is frozen
//bit 58: borrowing is enabled
//bit 59: stable rate borrowing enabled
//bit 60-63: reserved
//bit 64-79: reserve factor
export interface ReserveConfigurationMap extends BigNumber {}

export function reserveDataFromWeb3Result({
  configuration,
  liquidityIndex,
  variableBorrowIndex,
  currentLiquidityRate,
  currentVariableBorrowRate,
  currentStableBorrowRate,
  lastUpdateTimestamp,
  aTokenAddress,
  stableDebtTokenAddress,
  variableDebtTokenAddress,
  interestRateStrategyAddress,
  id,
}: Web3ReserveDataResult): LendingReserveData {
  return {
    configuration,
    liquidityIndex: FixedNumber.fromValue(liquidityIndex, 27),
    variableBorrowIndex: FixedNumber.fromValue(variableBorrowIndex, 27),
    currentLiquidityRate: FixedNumber.fromValue(currentLiquidityRate, 27),
    currentVariableBorrowRate: FixedNumber.fromValue(
      currentVariableBorrowRate,
      27
    ),
    currentStableBorrowRate: FixedNumber.fromValue(currentStableBorrowRate, 27),
    lastUpdateTimestamp,
    aTokenAddress,
    stableDebtTokenAddress,
    variableDebtTokenAddress,
    interestRateStrategyAddress,
    id,
  };
}

type Web3ReserveDataResult = PromisedType<
  ReturnType<typeof AgaveLendingABI.prototype.getReserveData>
>;

export const useLendingReserveData = buildQueryHookWhenParamsDefinedChainAddrs<
  LendingReserveData,
  [
    _p1: "AgaveLendingPool",
    _p2: "reserveData",
    assetAddress: string | undefined
  ],
  [assetAddress: string]
>(
  async (params, assetAddress) => {
    const contract = AgaveLendingABI__factory.connect(
      params.chainAddrs.aaveProtocolDataProvider,
      params.library.getSigner()
    );
    return await contract
      .getReserveData(assetAddress)
      .then(reserveData => reserveDataFromWeb3Result(reserveData));
  },
  assetAddress => ["AgaveLendingPool", "reserveData", assetAddress],
  () => undefined,
  {
    cacheTime: Infinity,
    staleTime: Infinity,
  }
);
