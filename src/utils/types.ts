export type TxData = {
  txHash: string;
  completedAt: Date | null;
  stepName: string;
  isComplete: boolean;
};

type PropOrNever<T, K extends keyof T> = {
  [Prop in keyof T]?: Prop extends K ? T[Prop] : never;
};

export type OnePropertyOf<T> = {
  [K in keyof T]: Pick<T, K> & PropOrNever<T, K>;
}[keyof T];
export type OneTaggedPropertyOf<T> = {
  [K in keyof T]: Pick<T, K> & PropOrNever<T, K> & { type: K };
}[keyof T];
export type PossibleTags<T extends { type: string }> = T["type"];
export type PossibleStates<T extends { type: unknown }> = T extends {
  type: infer K;
}
  ? K extends keyof T
    ? T[K]
    : never
  : never;

// type TestStateA = number;
// type TestStateB = { name: string };
// type TestStateC = { name: string };
// type TestState = OneTaggedPropertyOf<{ a: TestStateA; b: TestStateB, c: TestStateC }>;
// type PossibleTestTags = PossibleTags<TestState>;
// type PossibleTestStates = PossibleStates<TestState>;
// function f(t: TestState) {
//   if (t.type == "a") {
//     // `t` is known to be a TestStateA
//   }
// }
//
// const StateAComponent: React.FC<{
//   state: TestStateA;
//   dispatch: (nextState: TestState) => void;
// }> = ({ state: myNumber }) => {
//   return <>I'm state A! {myNumber}</>;
// };
//
// const StateBComponent: React.FC<{
//   state: TestStateB;
//   dispatch: (nextState: TestState) => void;
// }> = ({ state: { name: myName }, dispatch }) => {
//   return (
//     <>
//       I'm state B but some people know me as {myName}
//       <button onClick={() => dispatch({ type: "a", a: 1337 })}>
//         Click me to become state A
//       </button>
//     </>
//   );
// };
//
// const TestStateComponent: React.FC<{}> = () => {
//   const [state, setState] = React.useState<TestState>({ type: "a", a: 42 });
//   switch (state.type) {
//     case "a":
//       return <StateAComponent state={state.a} dispatch={setState} />;
//     case "b":
//       return <StateBComponent state={state.b} dispatch={setState} />;
//     case "c":
//       return <StateBComponent state={state.c} dispatch={setState} />;
//   }
// };
