import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";

export interface AuthenticatedAccount {
    address: string;
    networkId: string | undefined;
}

export interface AuthState {
    error?: Error | undefined;
    active?: AuthenticatedAccount | undefined;
}

const initialState: AuthState = {
    error: undefined,
    active: undefined,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        setActiveAccount: (state, address: PayloadAction<AuthenticatedAccount | undefined>) => ({
            ...state,
            active: address.payload,
        }),

        setError: (state, error: PayloadAction<Error | undefined>) => ({
            ...state,
            error: error.payload,
        }),

    }
});

export const { setActiveAccount, setError } = authSlice.actions;

export const selectActiveAccount = (state: RootState) => state.auth.active;
export const selectAddress = (state: RootState) => state.auth.active?.address;
export const selectNetworkId = (state: RootState) => state.auth.active?.networkId;
export const selectError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
