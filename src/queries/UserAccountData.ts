import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import { AgaveLendingABI, AgaveLendingABI__factory } from "../contracts";
import { PromisedType } from "../utils/promisedType";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../utils/queryBuilder";

export interface UserAccountData {
  // TODO: Is this actually in "native" tokens?
  totalCollateralEth: BigNumber; // e.g. 195776830917421 in wei
  totalDebtEth: BigNumber; // e.g. 91611984393903 in wei
  availableBorrowsEth: BigNumber; // e.g. 21566601559458 in wei
  currentLiquidationThreshold: FixedNumber; //  Fixed4 e.g. 7021 = 70.21%
  ltv: FixedNumber; //  Fixed4 e.g. 5781 = 57.81 MaximumLTV
  healthFactor: FixedNumber; //  Ray e.g. 1500403183017056862 = 1.50
}

function rayFixed(input: BigNumber): FixedNumber {
  return FixedNumber.fromValue(input, 27);
}

export function userAccountDataFromWeb3Result({
  totalCollateralETH, // e.g. 195776830917421 in wei
  totalDebtETH, // e.g. 91611984393903 in wei
  availableBorrowsETH, // e.g. 21566601559458 in wei
  currentLiquidationThreshold, //  Fixed4 e.g. 7021 = 70.21%
  ltv, //  Fixed4 e.g. 5781 = 57.81 MaximumLTV
  healthFactor, //  Ray e.g. 1500403183017056862 = 1.50
}: Web3UserAccountData): UserAccountData {
  return {
    totalCollateralEth: totalCollateralETH,
    totalDebtEth: totalDebtETH,
    availableBorrowsEth: availableBorrowsETH,
    currentLiquidationThreshold: FixedNumber.fromValue(
      currentLiquidationThreshold,
      4
    ),
    ltv: FixedNumber.fromValue(ltv, 4),
    healthFactor: rayFixed(healthFactor),
  };
}

type Web3UserAccountData = PromisedType<
  ReturnType<typeof AgaveLendingABI.prototype.getUserAccountData>
>;

export const useProtocolReserveConfiguration =
  buildQueryHookWhenParamsDefinedChainAddrs<
    UserAccountData,
    [
      _p1: "LendingPool",
      _p2: "userAccountData",
      accountAddress: string | undefined
    ],
    [accountAddress: string]
  >(
    async (params, accountAddress) => {
      const contract = AgaveLendingABI__factory.connect(
        params.chainAddrs.lendingPool,
        params.library.getSigner()
      );
      return await contract
        .getUserAccountData(accountAddress)
        .then(userAccountDataFromWeb3Result);
    },
    accountAddress => ["LendingPool", "userAccountData", accountAddress],
    () => undefined,
    {
      cacheTime: 60 * 15 * 1000,
      staleTime: 60 * 5 * 1000,
    }
  );
