import { configureStore, Action, ThunkAction } from "@reduxjs/toolkit";
import { rootReducer, RootState } from "./reducers";

const store = configureStore({
    reducer: rootReducer,
});

if (process.env.NODE_ENV === "development" && module.hot) {
    module.hot.accept('./reducers', () => {
        const newRootReducer = require('./reducers').default;
        store.replaceReducer(newRootReducer);
    });
}

export type { RootState };
export type AppDispatch = typeof store.dispatch;
export type AppThunk<T, R=void> = ThunkAction<R, RootState, null, Action<T>>;

export default store;
