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
  borderOffset: number;
  selectedIcons: IconData[];
}

const loadState = (): BannerState => {
  try {
    const serializedState = localStorage.getItem('bannerState');
    if (serializedState === null) {
      return {
        iconSize: 96,
        iconSpacing: 16,
        bannerWidth: 600,
        bannerHeight: 600,
        borderWidth: 2,
        borderRadius: 16,
        borderColor: '#000000',
        iconColor: '#374151',
        borderOffset: 0,
        selectedIcons: []
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      iconSize: 96,
      iconSpacing: 16,
      bannerWidth: 600,
      bannerHeight: 600,
      borderWidth: 2,
      borderRadius: 16,
      borderColor: '#000000',
      iconColor: '#374151',
      borderOffset: 0,
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
  setBorderOffset,
  addIcon,
  removeIcon
} = bannerSlice.actions;

export default bannerSlice.reducer;