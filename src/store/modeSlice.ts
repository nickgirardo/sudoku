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
      // With at most one valid mode, there is nothing to be changed
      if (state.valid.length <= 1)
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
      const getNextValid = (mode: EntryMode): EntryMode => {
        const m = getNext(mode);
        return state.valid.includes(m) ? m : getNextValid(m);
      }

      return { ...state, current: getNextValid(state.current) }
    },
    prevMode: (state) => {
      // With at most one valid mode, there is nothing to be changed
      if (state.valid.length <= 1)
        return;

      const getPrev = (mode: EntryMode): EntryMode => {
        switch (mode) {
          case EntryMode.Value:
            return EntryMode.Center;
          case EntryMode.Corner:
            return EntryMode.Value;
          case EntryMode.Center:
            return EntryMode.Corner;
          default:
            return assertNever(mode);
        }
      };

      // If the very next mode isn't valid, recurse until we find one which is
      const getPrevValid = (mode: EntryMode): EntryMode => {
        const m = getPrev(mode);
        return state.valid.includes(m) ? m : getPrevValid(m);
      }

      return { ...state, current: getPrevValid(state.current) }
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
  prevMode,
  setMode,
} = modeSlice.actions;

export const modeReducer = modeSlice.reducer;
