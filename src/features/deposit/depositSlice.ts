import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";

export interface DepositState {
}

const initialState: DepositState = {
};

export const depositSlice = createSlice({
    name: "deposit",
    initialState,
    reducers: {

    }
});

export const { } = depositSlice.actions;

export const selectActiveAccount = (state: RootState) => state.auth.active;
export const selectAddress = (state: RootState) => state.auth.active?.address;
export const selectNetworkId = (state: RootState) => state.auth.active?.networkId;
export const selectError = (state: RootState) => state.auth.error;

export default depositSlice.reducer;

