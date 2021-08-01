import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { boardReducer } from './store/boardSlice';
import { modeReducer } from './store/modeSlice';

const store = configureStore({
  reducer: {
    board: boardReducer,
    mode: modeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
