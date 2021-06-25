// Simple Sleep function: Pauses execution for time in milliseconds
export const sleep = (timeInMs: number) =>
  new Promise(resolve => setTimeout(resolve, timeInMs));

// Rounds any number or number thats a string to a string of 2 decimal places
export function round2Fixed(value: any) {
  value = +value;
  if (isNaN(value)) return NaN;
  value = value.toString().split("e");
  value = Math.round(+(value[0] + "e" + (value[1] ? +value[1] + 2 : 2)));
  value = value.toString().split("e");
  return (+(value[0] + "e" + (value[1] ? +value[1] - 2 : -2))).toFixed(2);
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
