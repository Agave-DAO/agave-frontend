import { BigNumber, FixedFormat, FixedNumber } from "@ethersproject/bignumber";

export const FixedRayFormat = FixedFormat.from("fixed256x27");

export function FixedFromRay(input: BigNumber): FixedNumber {
  return FixedNumber.fromValue(input, 27, FixedRayFormat);
}

/**
 * Allows division by zero only if the division is not zero, otherwise returns the dividend itself
 * @param base Number to divide
 * @param divisor Quite divisive
 */
export function divIfNotZeroUnsafe(
  dividend: FixedNumber,
  divisor: FixedNumber
): FixedNumber {
  if (divisor.isZero()) {
    if (dividend.isZero()) {
      return dividend;
    } else {
      throw new Error("Division by zero where the base was not also zero");
    }
  }
  return dividend.divUnsafe(divisor);
}
