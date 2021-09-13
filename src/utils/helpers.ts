import { BigNumber, BigNumberish } from "ethers";

// Simple Sleep function: Pauses execution for time in milliseconds
export const sleep = (timeInMs: number) =>
  new Promise(resolve => setTimeout(resolve, timeInMs));

// Rounds any number or number as a string to a string of 2 decimal places for front end display.
// Helpful for condensing large string numbers easily for front-end view.
export function round2Fixed(value: number | string): string | typeof NaN {
  let v: any;
  v = +value;
  v = value.toString().split("e");
  v = Math.round(+(v[0] + "e" + (v[1] ? +v[1] + 2 : 2)));
  v = v.toString().split("e");
  return (+(v[0] + "e" + (v[1] ? +v[1] - 2 : -2))).toFixed(2);
}

// Find percent differnce of two numbers
export function pctDiff(a: number, b: number) {
  return 100 * Math.abs((a - b) / ((a + b) / 2));
}

// Find percent differnce of two numbers
export function pctLeft(a: number, b: number) {
  return (100 * (a - b)) / ((a + b) / 2);
}

// Find specific known percent of particular number
export function calcPct(num: number, per: number) {
  return (num / 100) * per;
}

// Take the lesser of A and B, preferring A if both are equal
export function bnMinish(a: BigNumber, b: BigNumberish): BigNumber {
  const bbn = BigNumber.isBigNumber(b) ? b : BigNumber.from(b);
  return a.lte(bbn) ? a : bbn;
}

// Take the lesser of A and B, preferring A if both are equal; Requires that both are BigNumber
export function bnMin(a: BigNumber, b: BigNumber): BigNumber {
  return a.lte(b) ? a : b;
}

// Take the lesser of A and B, preferring A if both are equal
// Short-circuits with an equivalent nullish state when either side is nullish
export function bnMinishNullCoalescing(
  a: BigNumber,
  b: BigNumberish
): BigNumber;
export function bnMinishNullCoalescing(
  a: BigNumber | null,
  b: BigNumberish | null
): BigNumber | null;
export function bnMinishNullCoalescing(
  a: BigNumber | undefined,
  b: BigNumberish | undefined
): BigNumber | undefined;
export function bnMinishNullCoalescing(
  a: BigNumber | null | undefined,
  b: BigNumberish | null | undefined
): BigNumber | null | undefined;
export function bnMinishNullCoalescing(
  a: BigNumber | null | undefined,
  b: BigNumberish | null | undefined
): BigNumber | null | undefined {
  // If either is null or undefined, return its nullish state
  // Gotta love linters- can't just use `x == null` or it gets angry
  if (a === null || a === undefined) {
    return a;
  }
  // `b` is separate because a single a or b being null doesn't tell us which was null
  if (b === null || b === undefined) {
    return b;
  }
  const bbn = BigNumber.isBigNumber(b) ? b : BigNumber.from(b);
  return a.lte(bbn) ? a : bbn;
}

// Take the lesser of A and B, preferring A if both are equal; Requires that both are BigNumber
// Short-circuits with an equivalent nullish state when either side is nullish
export function bnMinNullCoalescing(a: BigNumber, b: BigNumber): BigNumber;
export function bnMinNullCoalescing(
  a: BigNumber | null,
  b: BigNumber | null
): BigNumber | null;
export function bnMinNullCoalescing(
  a: BigNumber | undefined,
  b: BigNumber | undefined
): BigNumber | undefined;
export function bnMinNullCoalescing(
  a: BigNumber | null | undefined,
  b: BigNumber | null | undefined
): BigNumber | null | undefined;
export function bnMinNullCoalescing(
  a: BigNumber | null | undefined,
  b: BigNumber | null | undefined
): BigNumber | null | undefined {
  // If either is null or undefined, return its nullish state
  // Gotta love linters- can't just use `x == null` or it gets angry
  if (a === null || a === undefined) {
    return a;
  }
  // `b` is separate because a single a or b being null doesn't tell us which was null
  if (b === null || b === undefined) {
    return b;
  }
  return a.lte(b) ? a : b;
}

// Take the greater of A and B, preferring A if both are equal
export function bnMaxish(a: BigNumber, b: BigNumberish): BigNumber {
  const bbn = BigNumber.isBigNumber(b) ? b : BigNumber.from(b);
  return a.gte(bbn) ? a : bbn;
}

// Take the greater of A and B, preferring A if both are equal; Requires that both are BigNumber
export function bnMax(a: BigNumber, b: BigNumberish): BigNumber {
  const bbn = BigNumber.isBigNumber(b) ? b : BigNumber.from(b);
  return a.gte(bbn) ? a : bbn;
}

// Take the greater of A and B, preferring A if both are equal
// Short-circuits with an equivalent nullish state when either side is nullish
export function bnMaxishNullCoalescing(
  a: BigNumber,
  b: BigNumberish
): BigNumber;
export function bnMaxishNullCoalescing(
  a: BigNumber | null,
  b: BigNumberish | null
): BigNumber | null;
export function bnMaxishNullCoalescing(
  a: BigNumber | undefined,
  b: BigNumberish | undefined
): BigNumber | undefined;
export function bnMaxishNullCoalescing(
  a: BigNumber | null | undefined,
  b: BigNumberish | null | undefined
): BigNumber | null | undefined;
export function bnMaxishNullCoalescing(
  a: BigNumber | null | undefined,
  b: BigNumberish | null | undefined
): BigNumber | null | undefined {
  // If either is null or undefined, return its nullish state
  // Gotta love linters- can't just use `x == null` or it gets angry
  if (a === null || a === undefined) {
    return a;
  }
  // `b` is separate because a single a or b being null doesn't tell us which was null
  if (b === null || b === undefined) {
    return b;
  }
  const bbn = BigNumber.isBigNumber(b) ? b : BigNumber.from(b);
  return a.gte(bbn) ? a : bbn;
}

// Take the greater of A and B, preferring A if both are equal; Requires that both are BigNumber
// Short-circuits with an equivalent nullish state when either side is nullish
export function bnMaxNullCoalescing(a: BigNumber, b: BigNumber): BigNumber;
export function bnMaxNullCoalescing(
  a: BigNumber | null,
  b: BigNumber | null
): BigNumber | null;
export function bnMaxNullCoalescing(
  a: BigNumber | undefined,
  b: BigNumber | undefined
): BigNumber | undefined;
export function bnMaxNullCoalescing(
  a: BigNumber | null | undefined,
  b: BigNumber | null | undefined
): BigNumber | null | undefined;
export function bnMaxNullCoalescing(
  a: BigNumber | null | undefined,
  b: BigNumber | null | undefined
): BigNumber | null | undefined {
  // If either is null or undefined, return its nullish state
  // Gotta love linters- can't just use `x == null` or it gets angry
  if (a === null || a === undefined) {
    return a;
  }
  // `b` is separate because a single a or b being null doesn't tell us which was null
  if (b === null || b === undefined) {
    return b;
  }
  return a.gte(b) ? a : b;
}
