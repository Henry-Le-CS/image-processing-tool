import { IImageData, ITrafficData } from '@/data/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IImageListState {
  data: {
    [key:string]: IImageData;
  };
}

// Define the initial state using that type
const initialState: IImageListState = {
  data: {},
};

export const imageListSlice = createSlice({
  name: 'imageList',
  initialState,
  reducers: {
    updateOne: (
      state,
      action: PayloadAction<{ id: string; data: ITrafficData }>
    ) => {
      state.data[action.payload.id] = {
        ...state.data[action.payload.id],
        isModified: true,
        trafficCondition: action.payload.data,
      };
    },
    resetOne: (state, action: PayloadAction<string>) => {
      state.data[action.payload].isModified = false;
    },
    setAll: (state, action: PayloadAction<IImageListState>) => {
      state.data = action.payload.data;
    },
  },
});

export const { updateOne, resetOne, setAll } = imageListSlice.actions;

// Other code such as selectors can use the imported `rootState` type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectImageList = (state: any) => state.imageList.data;

export default imageListSlice.reducer;
