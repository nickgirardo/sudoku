import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { assertNever } from '../util';
import { EntryMode } from '../@types/sudoku';

interface ModeState {
  current: EntryMode,
  valid: Array<EntryMode>,
}

const initialState: ModeState = {
  current: EntryMode.Value,
  valid: [EntryMode.Value, EntryMode.Corner, EntryMode.Center],
};


export const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    setValidModes: (state, { payload }: PayloadAction<Array<EntryMode>>) => {
      state.valid = payload;
    },
    nextMode: (state) => {
      // If we don't have any valid modes, return early here
      // Knowing there are valid modes lets us make helpful assumptions later
      if (state.valid.length === 0)
        return;

      const getNext = (mode: EntryMode): EntryMode => {
        switch (mode) {
          case EntryMode.Value:
            return EntryMode.Corner;
          case EntryMode.Corner:
            return EntryMode.Center;
          case EntryMode.Center:
            return EntryMode.Value;
          default:
            return assertNever(mode);
        }
      };

      // If the very next mode isn't valid, recurse until we find one which is
      const getNextValid = (mode: EntryMode): EntryMode =>
        state.valid.includes(getNext(mode)) ?
          getNext(mode) :
          getNextValid(getNext(mode));

      return { ...state, current: getNextValid(state.current) }
    },
    setMode: (state, { payload }: PayloadAction<EntryMode>) => {
      if (state.valid.includes(payload))
        state.current = payload;
    },
  },
});

export const {
  setValidModes,
  nextMode,
  setMode,
} = modeSlice.actions;

export const modeReducer = modeSlice.reducer;
