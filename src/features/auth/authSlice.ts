import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";

interface AuthState {
    error?: string | undefined;
    address?: string | undefined;
    networkId?: string | undefined;
    connectType?: string | undefined;
}

const initialState: AuthState = {
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        setAddress: (state, address: PayloadAction<string>) => ({
            ...state,
            address: address.payload
        }),

        setNetworkId: (state, networkId: PayloadAction<string>) => ({
            ...state,
            networkId: networkId.payload
        }),

        setConnectType: (state, connectType: PayloadAction<string>) => ({
            ...state,
            connectType: connectType.payload
        }),

        setError: (state, error: PayloadAction<string>) => ({
            ...state,
            error: error.payload
        }),

    }
});

export const { setAddress, setNetworkId, setConnectType, setError } = authSlice.actions;

export const selectAddress = (state: RootState) => state.auth.address;
export const selectNetworkId = (state: RootState) => state.auth.networkId;
export const selectConnectType = (state: RootState) => state.auth.connectType;
export const selectError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
