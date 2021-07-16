import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import {
  AaveProtocolDataProvider,
  AaveProtocolDataProvider__factory,
} from "../contracts";
import { FixedFromRay } from "../utils/fixedPoint";
import { PromisedType } from "../utils/promisedType";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export interface ReserveAssetConfiguration {
  decimals: BigNumber;
  ltv: FixedNumber; // 4-fractional-decimal precision ratio e.g. 0.5000 => 50%, 1.2500 => 1.25
  liquidationThreshold: FixedNumber;
  liquidationBonus: FixedNumber;
  reserveFactor: FixedNumber;
  usageAsCollateralEnabled: boolean;
  borrowingEnabled: boolean;
  stableBorrowRateEnabled: boolean;
  isActive: boolean;
  isFrozen: boolean;
}

// Each of these hints at the maximum possible lengths or precisions of the raw values:
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

export function reserveConfigurationFromWeb3Result({
  decimals,
  ltv,
  liquidationThreshold,
  liquidationBonus,
  reserveFactor,
  usageAsCollateralEnabled,
  borrowingEnabled,
  stableBorrowRateEnabled,
  isActive,
  isFrozen,
}: Web3ProtocolReserveDataResult): ReserveAssetConfiguration {
  return {
    decimals,
    ltv: FixedNumber.fromValue(ltv, 4),
    liquidationThreshold: FixedFromRay(liquidationThreshold),
    liquidationBonus: FixedFromRay(liquidationBonus),
    reserveFactor: FixedFromRay(reserveFactor),
    usageAsCollateralEnabled,
    borrowingEnabled,
    stableBorrowRateEnabled,
    isActive,
    isFrozen,
  };
}

type Web3ProtocolReserveDataResult = PromisedType<
  ReturnType<
    typeof AaveProtocolDataProvider.prototype.getReserveConfigurationData
  >
>;

export const useProtocolReserveConfiguration =
  buildQueryHookWhenParamsDefinedChainAddrs<
    ReserveAssetConfiguration,
    [
      _p1: "AaveProtocolDataProvider",
      _p2: "assetConfiguration",
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
        .getReserveConfigurationData(assetAddress)
        .then(reserveConfiguration =>
          reserveConfigurationFromWeb3Result(reserveConfiguration)
        );
    },
    assetAddress => [
      "AaveProtocolDataProvider",
      "assetConfiguration",
      assetAddress,
    ],
    () => undefined,
    {
      cacheTime: 60 * 15 * 1000,
      staleTime: 60 * 5 * 1000,
    }
  );
