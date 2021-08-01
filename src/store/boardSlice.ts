import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import {
  emptyCell,
  givenCell,
  emptyValue,
  setValue,
} from '../util';

import {
  Cell,
  CellIndex,
  SetValue,
} from '../@types/sudoku';

import { BOARD_SIZE } from '../constants';

// TODO these types aren't super ergonomic
type SetCellPayload = SetValue & { ix: CellIndex };
type SetCellsPayload = SetValue & { ixs: Array<CellIndex> };

const maybeGiven = (_, ix: number) =>
  Math.random() > 0.2 ?
    emptyCell() :
    givenCell((ix % 9) + 1);

export const boardSlice = createSlice({
  name: 'board',
  initialState: new Array(BOARD_SIZE).fill(0).map(maybeGiven) as Array<Cell>,
  reducers: {
    clearCell: (state, action: PayloadAction<CellIndex>) => {
      state[action.payload].value = emptyValue();
    },
    clearCells: (state, action: PayloadAction<Array<CellIndex>>) => {
      for (const cell of action.payload)
        state[cell].value = emptyValue();
    },
    setCell: (state, action: PayloadAction<SetCellPayload>) => {
      state[action.payload.ix].value = setValue(action.payload.value);
    },
    setCells: (state, action: PayloadAction<SetCellsPayload>) => {
      for (const cell of action.payload.ixs)
        state[cell].value = setValue(action.payload.value);
    },
  },
});

export const {
  clearCell,
  clearCells,
  setCell,
  setCells,
} = boardSlice.actions;

export const boardReducer = boardSlice.reducer;
