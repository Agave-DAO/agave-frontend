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
