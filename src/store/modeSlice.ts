import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { assertNever } from '../util';
import { EntryMode } from '../@types/sudoku';

export const modeSlice = createSlice({
  name: 'mode',
  initialState: EntryMode.Value,
  reducers: {
    nextMode: (state) => {
      switch (state) {
        case EntryMode.Value:
          return EntryMode.Corner;
        case EntryMode.Corner:
          return EntryMode.Center;
        case EntryMode.Center:
          return EntryMode.Value;
        default:
          assertNever(state);
      }
    },
    setMode: (state, action: PayloadAction<EntryMode>) => {
      state = action.payload;
    },
  },
});

export const {
  nextMode,
  setMode,
} = modeSlice.actions;

export const modeReducer = modeSlice.reducer;
