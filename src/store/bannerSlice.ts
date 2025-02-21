import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IconData } from '../types/icon';

interface BannerState {
  iconSize: number;
  iconSpacing: number;
  bannerWidth: number;
  bannerHeight: number;
  borderWidth: number;
  borderRadius: number;
  borderColor: string;
  iconColor: string;
  iconColors: string[];
  borderOffset: number;
  selectedIcons: IconData[];
}

const defaultState: BannerState = {
  iconSize: 96,
  iconSpacing: 16,
  bannerWidth: 600,
  bannerHeight: 600,
  borderWidth: 2,
  borderRadius: 16,
  borderColor: '#000000',
  iconColor: '#374151',
  iconColors: ['#374151', '#374151', '#374151', '#374151'],
  borderOffset: 0,
  selectedIcons: []
};

const loadState = (): BannerState => {
  try {
    const serializedState = localStorage.getItem('bannerState');
    if (serializedState === null) {
      return defaultState;
    }
    const parsedState = JSON.parse(serializedState);
    // Ensure iconColors exists and has 4 elements
    if (!parsedState.iconColors || !Array.isArray(parsedState.iconColors) || parsedState.iconColors.length !== 4) {
      parsedState.iconColors = [...defaultState.iconColors];
    }
    return parsedState;
  } catch (err) {
    return defaultState;
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
    setBorderWidth: (state, action: PayloadAction<number>) => {
      state.borderWidth = action.payload;
    },
    setBorderRadius: (state, action: PayloadAction<number>) => {
      state.borderRadius = action.payload;
    },
    setBorderColor: (state, action: PayloadAction<string>) => {
      state.borderColor = action.payload;
    },
    setIconColor: (state, action: PayloadAction<string>) => {
      state.iconColor = action.payload;
      // Update all icon colors when the global color changes
      state.iconColors = state.iconColors.map(() => action.payload);
    },
    setIconColorAtIndex: (state, action: PayloadAction<{ index: number; color: string }>) => {
      if (state.iconColors && action.payload.index >= 0 && action.payload.index < 4) {
        state.iconColors[action.payload.index] = action.payload.color;
      }
    },
    setBorderOffset: (state, action: PayloadAction<number>) => {
      state.borderOffset = action.payload;
    },
    addIcon: (state, action: PayloadAction<IconData>) => {
      if (state.selectedIcons.length < 4) {
        state.selectedIcons.push(action.payload);
      }
    },
    removeIcon: (state, action: PayloadAction<number>) => {
      state.selectedIcons.splice(action.payload, 1);
      // Reset the color for the removed icon position to the default
      state.iconColors[action.payload] = state.iconColor;
    }
  }
});

export const {
  setIconSize,
  setIconSpacing,
  setBannerWidth,
  setBannerHeight,
  setBorderWidth,
  setBorderRadius,
  setBorderColor,
  setIconColor,
  setIconColorAtIndex,
  setBorderOffset,
  addIcon,
  removeIcon
} = bannerSlice.actions;

export default bannerSlice.reducer;