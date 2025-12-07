// import { useDispatch, useSelector, useStore } from 'react-redux'
// import type { AppDispatch, AppStore, RootState } from './store'

// // Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
// export const useAppSelector = useSelector.withTypes<RootState>()
// export const useAppStore = useStore.withTypes<AppStore>()

// ////////////////////////////////////////////////
// ////////////////////////////////////////////////
// ////////////////////////////////////////////////
// ////////////////////////////////////////////////

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";

export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);

export const useAppDispatch = () => useDispatch<AppDispatch>();
