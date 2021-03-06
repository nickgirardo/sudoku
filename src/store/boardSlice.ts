import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import {
  Cell,
  GivenCell,
  ValueCell,
  MarkCell,
  CellIndex,
  EntryMode,
} from '../@types/sudoku';

import {
  clearCell as _clearCell,
  setCell as _setCell,
  newMarkCell,
  newGivenCell,
} from '../util';

import { BOARD_SIZE } from '../constants';

type SetCellPayload = { mode: EntryMode, ix: CellIndex, value: number };
type SetCellsPayload = { mode: EntryMode, ixs: Array<CellIndex>, value: number };

export const boardSlice = createSlice({
  name: 'board',
  initialState: new Array(BOARD_SIZE).fill(0).map(() => newMarkCell()) as Array<Cell>,
  reducers: {
    setupBoard: (state, action: PayloadAction<Array<[number, number]>>) => {
      for (const [cell, value] of action.payload)
        state[cell] = newGivenCell(value);
    },
    clearCell: (state, action: PayloadAction<CellIndex>) => {
      state[action.payload] = _clearCell(state[action.payload]);
    },
    clearCells: (state, action: PayloadAction<Array<CellIndex>>) => {
      for (const cell of action.payload)
        state[cell] = _clearCell(state[cell]);
    },
    setCell: (state, action: PayloadAction<SetCellPayload>) => {
      const cell = action.payload.ix;
      state[cell] = _setCell(action.payload.mode, state[cell], action.payload.value);
    },
    setCells: (state, action: PayloadAction<SetCellsPayload>) => {
      for (const cell of action.payload.ixs)
        state[cell] = _setCell(action.payload.mode, state[cell], action.payload.value);
    },
  },
});

export const {
  setupBoard,
  clearCell,
  clearCells,
  setCell,
  setCells,
} = boardSlice.actions;

export const boardReducer = boardSlice.reducer;
