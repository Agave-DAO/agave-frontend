import {
  SliceCaseReducers,
  CreateSliceOptions,
  Slice,
  createSlice,
} from "@reduxjs/toolkit";

/**
 * A createSlice wrapper with an explicit state type
 * @see `createExplicitStateSlicer`
 */
export interface ExplicitStateCaseReducer<State> {
  <CaseReducers extends SliceCaseReducers<State>, Name extends string = string>(
    options: CreateSliceOptions<State, CaseReducers, Name>
  ): Slice<State, CaseReducers, Name>;
}

/**
 * TypeScript doesn't allow us to pass "only some" generic parameters and leave the rest to inference
 *
 * This trick lets us return a specialized `createSlice` that only accepts one explicit state,
 * eliminating room for error and improving compilation errors within the slice call.
 *
 * @returns `ExplicitStateCaseReducer<State>`
 */
export function createExplicitStateSlicer<
  State
>(): ExplicitStateCaseReducer<State> {
  return createSlice;
}
