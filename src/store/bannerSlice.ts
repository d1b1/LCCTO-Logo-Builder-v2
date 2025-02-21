import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IconData } from '../types/icon';

interface BannerState {
  iconSize: number;
  iconSpacing: number;
  bannerWidth: number;
  bannerHeight: number;
  selectedIcons: IconData[];
}

const loadState = (): BannerState => {
  try {
    const serializedState = localStorage.getItem('bannerState');
    if (serializedState === null) {
      return {
        iconSize: 24,
        iconSpacing: 48,
        bannerWidth: 600,
        bannerHeight: 100,
        selectedIcons: []
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      iconSize: 24,
      iconSpacing: 48,
      bannerWidth: 600,
      bannerHeight: 100,
      selectedIcons: []
    };
  }
};

const initialState: BannerState = loadState();

export const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    setIconSize: (state, action: PayloadAction<number>) => {
      state.iconSize = action.payload;
    },
    setIconSpacing: (state, action: PayloadAction<number>) => {
      state.iconSpacing = action.payload;
    },
    setBannerWidth: (state, action: PayloadAction<number>) => {
      state.bannerWidth = action.payload;
    },
    setBannerHeight: (state, action: PayloadAction<number>) => {
      state.bannerHeight = action.payload;
    },
    addIcon: (state, action: PayloadAction<IconData>) => {
      state.selectedIcons.push(action.payload);
    },
    removeIcon: (state, action: PayloadAction<number>) => {
      state.selectedIcons.splice(action.payload, 1);
    },
    reorderIcons: (state, action: PayloadAction<IconData[]>) => {
      state.selectedIcons = action.payload;
    }
  }
});

export const {
  setIconSize,
  setIconSpacing,
  setBannerWidth,
  setBannerHeight,
  addIcon,
  removeIcon,
  reorderIcons
} = bannerSlice.actions;

export default bannerSlice.reducer;