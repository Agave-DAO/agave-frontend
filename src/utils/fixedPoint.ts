import { PinInput } from "@chakra-ui/react";
import {
  BigNumber,
  BigNumberish,
  FixedFormat,
  FixedNumber,
} from "@ethersproject/bignumber";
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
  decimalsTarget: BigNumberish = 2,
  assetDecimals: BigNumberish = 18
): string {
  if (!input || input === null || input.isZero()) {
    return "0";
  } else if (input.gt("999999999999999999999999999999")) {
    return "∞";
  }
  let decimalsTargetNum: number =
    typeof decimalsTarget === "number"
      ? decimalsTarget | 0
      : BigNumber.from(decimalsTarget).toNumber();
  const decimalsAsset: number =
    typeof assetDecimals === "number"
      ? assetDecimals | 0
      : BigNumber.from(assetDecimals).toNumber();
  const inputAsString = Number(
    ethers.utils.formatUnits(input, decimalsAsset)
  ).toFixed(decimalsTargetNum);
  let outputStr = inputAsString;

  while (decimalsTargetNum >= 0) {
    if (outputStr.endsWith("0") || outputStr.endsWith(".")) {
      outputStr = outputStr.slice(0, -1);
    } else decimalsTargetNum = 0;
    decimalsTargetNum--;
  }
  return outputStr;
}

export function fixedNumberToPercentage(
  input: FixedNumber | null | undefined,
  decimalsTarget: BigNumberish = 2,
  minimumNumberOfDecimals: BigNumberish = 0
): string {
  if (!input || input === null || input.isZero()) {
    return "0";
  }
  const inputAsFloat = input.toUnsafeFloat();
  const minimumNumbOfDecimals: number =
    typeof minimumNumberOfDecimals === "number"
      ? minimumNumberOfDecimals | 0
      : BigNumber.from(minimumNumberOfDecimals).toNumber();
  let decimalsTargetNum: number =
    typeof decimalsTarget === "number"
      ? decimalsTarget | 0
      : BigNumber.from(decimalsTarget).toNumber();
  let outputStr = (inputAsFloat * 100).toFixed(decimalsTargetNum);

  // trim trailing 0's and the dot if it's the decimal separator
  while (decimalsTargetNum >= minimumNumbOfDecimals) {
    if (
      outputStr.endsWith("0") ||
      (decimalsTargetNum === 0 && outputStr.endsWith("."))
    ) {
      outputStr = outputStr.slice(0, -1);
    } else decimalsTargetNum = -1;
    decimalsTargetNum--;
  }
  return outputStr;
}
