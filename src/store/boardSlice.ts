import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import {
  emptyCell,
  valueCell,
  getIndex,
} from '../util';

import {
  Cell,
  CellIndex,
  SetValue,
} from '../@types/sudoku';

import { BOARD_SIZE } from '../constants';

type SetCellPayload = SetValue & { ix: CellIndex };

export const boardSlice = createSlice({
  name: 'board',
  initialState: new Array(BOARD_SIZE).fill(0).map(() => emptyCell()) as Array<Cell>,
  reducers: {
    // TODO I shouldn't need to be handling the state like this
    // will try to find out why ts is complaining
    clearCell: (state, action: PayloadAction<CellIndex>) => {
      state[action.payload] = emptyCell();
    },
    setCell: (state, action: PayloadAction<SetCellPayload>) => {
      state[action.payload.ix] = valueCell(action.payload.value);
    },
  },
});

export const { clearCell, setCell } = boardSlice.actions;

export const boardReducer = boardSlice.reducer;
