// import { configureStore } from '@reduxjs/toolkit'
// import { authApi } from './features/auth/authApi'
// import authReducer from './features/auth/authSlice'

// export const makeStore = () => {
//   return configureStore({
//     reducer: {
//       [authApi.reducerPath]: authApi.reducer,
//       auth: authReducer,
//     },
//     middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware().concat(authApi.middleware),
//   })
// }

// // Infer the type of makeStore
// export type AppStore = ReturnType<typeof makeStore>
// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<AppStore['getState']>
// export type AppDispatch = AppStore['dispatch']

// //////////////////////////////////
// //////////////////////////////////
// //////////////////////////////////
// //////////////////////////////////

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./features/auth/authSlice";
import { authApi } from "./features/auth/authApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
