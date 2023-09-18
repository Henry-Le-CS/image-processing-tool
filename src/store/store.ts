import { configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { TypedUseSelectorHook, useDispatch } from 'react-redux';
import imageListReducer from './reducers/imageListReducer';

export const store = configureStore({
  reducer: {
    imageList: imageListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

type dispatchFunc = () => AppDispatch;
export const useAppDispatch: dispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
