import { configureStore } from '@reduxjs/toolkit';
import bannerReducer from './bannerSlice';

export const store = configureStore({
  reducer: {
    banner: bannerReducer
  }
});

store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem('bannerState', JSON.stringify(state.banner));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;