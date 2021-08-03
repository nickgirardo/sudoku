import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { uniq } from 'lodash';

export const selectedSlice = createSlice({
  name: 'selected',
  initialState: [] as Array<number>,
  reducers: {
    deselectAll: (state) => [],
    selectCell: (state, action: PayloadAction<number>) =>
      state = uniq([action.payload, ...state]),
  },
});

export const {
  selectCell,
  deselectAll,
} = selectedSlice.actions;

export const selectedReducer = selectedSlice.reducer;

