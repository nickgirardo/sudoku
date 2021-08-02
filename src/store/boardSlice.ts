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
} from '../@types/sudoku';

import {
  clearCell as _clearCell,
  setCellValue,
  newMarkCell,
  newGivenCell,
} from '../util';

import { BOARD_SIZE } from '../constants';

type SetCellPayload = { ix: CellIndex, value: number };
type SetCellsPayload = { ixs: Array<CellIndex>, value: number };

const maybeGiven = (ix: number) =>
  Math.random() > 0.2 ?
    newMarkCell() :
    newGivenCell((ix % 9) + 1);

export const boardSlice = createSlice({
  name: 'board',
  initialState: new Array(BOARD_SIZE).fill(0).map((_, ix) => maybeGiven(ix)) as Array<Cell>,
  reducers: {
    clearCell: (state, action: PayloadAction<CellIndex>) => {
      state[action.payload] = _clearCell(state[action.payload]);
    },
    clearCells: (state, action: PayloadAction<Array<CellIndex>>) => {
      for (const cell of action.payload)
        state[cell] = _clearCell(state[cell]);
    },
    setCell: (state, action: PayloadAction<SetCellPayload>) => {
      const cell = action.payload.ix;
      state[cell] = setCellValue(state[cell], action.payload.value);
    },
    setCells: (state, action: PayloadAction<SetCellsPayload>) => {
      for (const cell of action.payload.ixs)
        state[cell] = setCellValue(state[cell], action.payload.value);
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
