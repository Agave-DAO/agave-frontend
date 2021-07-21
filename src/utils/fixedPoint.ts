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
  decimalsTarget: number = 2
): string {
  if (!input || input === null || input.isZero()) {
    return "0";
  } else if (input.gt("999999999999999999999999999999")) {
    return "∞";
  }
  const inputAsString = Number(ethers.utils.formatEther(input)).toFixed(
    decimalsTarget
  );
  let outputStr = inputAsString;
  while (decimalsTarget >= 0) {
    if (outputStr.endsWith("0") || outputStr.endsWith(".")) {
      outputStr = outputStr.slice(0, -1);
    } else decimalsTarget = 0;
    decimalsTarget--;
  }
  return outputStr;
}

export function fixedNumberToPercentage(
  input: FixedNumber | null | undefined,
  decimalsTarget: number = 2,
  minimumNumberOfDecimals: number = 0
): string {
  if (!input || input === null || input.isZero()) {
    return "0";
  }
  const inputAsFloat = input.toUnsafeFloat();
  let outputStr = (inputAsFloat * 100).toFixed(decimalsTarget);
  // trim trailing 0's and the dot if it's the decimal separator
  while (decimalsTarget >= minimumNumberOfDecimals) {
    if (outputStr.endsWith("0") || (decimalsTarget = 0 && outputStr.endsWith("."))) {
      outputStr = outputStr.slice(0, -1);
    } else decimalsTarget = 0;
    decimalsTarget--;
  }
  return outputStr;
}
