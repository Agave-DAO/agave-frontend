import { PinInput } from "@chakra-ui/react";
import { BigNumber, FixedFormat, FixedNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";

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

export function bigNumberToString(
  input: BigNumber | null | undefined,
  decimals: number | number = 2
): String {
  if (!input || input === null || input.isZero()) {
    return "0";
  } else if (input.gt("999999999999999999999999999999")) {
    return "∞";
  }
  const str = Number(ethers.utils.formatEther(input)).toFixed(decimals);
  let i = 1;
  let output = str;
  while (decimals >= 0) {
    if (output.endsWith("0") || output.endsWith(".")) {
      output = output.slice(0, -1);
    } else decimals = 0;
    decimals--;
    i++;
  }
  return output;
}

export function fixedNumberToPercentage(
  input: FixedNumber | null | undefined,
  decimals: number | number = 2
): String {
  if (!input || input === null || input.isZero()) {
    return "0";
  }
  const str = input.toUnsafeFloat();
  let output = (str * 100).toFixed(decimals);
  let i = 1;
  while (decimals >= 0) {
    if (output.endsWith("0") || output.endsWith(".")) {
      output = output.slice(0, -1);
    } else decimals = 0;
    decimals--;
    i++;
  }

  return output;
}
