import { IImageData, ITrafficData } from '@/data/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IImageListState {
  data: {
    [key: string]: IImageData;
  };
  remainingCount: number;
}

// Define the initial state using that type
const initialState: IImageListState = {
  data: {},
  remainingCount: -1,
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
    resetAll: (state) => {
      for (const [fileId, imageData] of Object.entries(state.data)) {
        state.data[fileId] = {
          ...imageData,
          isModified: false,
          isSelected: false, // Also deselect
          trafficCondition: {},
        };
      }
    },
    setAll: (state, action: PayloadAction<IImageListState>) => {
      state.data = action.payload.data;
      state.remainingCount = action.payload.remainingCount;
    },
    selectOne: (
      state,
      action: PayloadAction<{ fileId: string; isSelected: boolean }>
    ) => {
      const fileId = action.payload.fileId;
      const isSelected = action.payload.isSelected;

      state.data[fileId].isSelected = isSelected;
    },
    selectAll: (state) => {
      for (const [fileId, imageData] of Object.entries(state.data)) {
        state.data[fileId] = {
          ...imageData,
          isSelected: true,
        };
      }
    },
    deselectAll: (state) => {
      for (const [fileId, imageData] of Object.entries(state.data)) {
        state.data[fileId] = {
          ...imageData,
          isSelected: false,
        };
      }
    },
    updateSelected: (state, action: PayloadAction<{ data: ITrafficData }>) => {
      for (const [fileId, imageData] of Object.entries(state.data)) {
        if (imageData.isSelected) {
          state.data[fileId] = {
            ...imageData,
            isModified: true,
            isSelected: false, // Deselect once we modified
            trafficCondition: action.payload.data,
          };
        }
      }
    },
  },
});

export const {
  updateOne,
  resetOne,
  setAll,
  resetAll,
  selectOne,
  selectAll,
  deselectAll,
  updateSelected,
} = imageListSlice.actions;

// Other code such as selectors can use the imported `rootState` type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectImageList = (state: any) => state.imageList.data;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectRemainingImageCount = (state: any) =>
  state.imageList.remainingCount;

export default imageListSlice.reducer;
