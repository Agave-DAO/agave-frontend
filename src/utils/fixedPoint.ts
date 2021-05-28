import { BigNumber, FixedFormat, FixedNumber } from "@ethersproject/bignumber";

export const FixedRayFormat = FixedFormat.from("fixed256x27")

export function FixedFromRay(input: BigNumber): FixedNumber {
  return FixedNumber.fromValue(input, 27, FixedRayFormat);
}
