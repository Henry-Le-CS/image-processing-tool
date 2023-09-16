import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { default as counterReducer } from "./reducers/counterReducer";

export const store = configureStore({
    reducer:{
        counter: counterReducer
    }
}) 

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

type dispatchFunc = () => AppDispatch
export const useAppDispatch: dispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector