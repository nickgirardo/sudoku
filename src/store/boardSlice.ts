import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import {
  Cell,
  CellType,
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

// The tuple is Ix, OldValue, NewValue
// Undo uses the old value, redo uses the new value
type HistEntry = Array<[CellIndex, Cell, Cell]>;

export const boardSlice = createSlice({
  name: 'board',
  initialState: {
    board: new Array(BOARD_SIZE).fill(0).map(() => newMarkCell()) as Array<Cell>,
    history: [] as Array<HistEntry>,
    historyIx: 0,
  },
  reducers: {
    setupBoard: (state, action: PayloadAction<Array<[number, number]>>) => {
      for (const [cell, value] of action.payload)
        state.board[cell] = newGivenCell(value);
    },
    clearCells: (state, action: PayloadAction<Array<CellIndex>>) => {
      const toBeCleared = action.payload.filter(c => state.board[c].kind !== CellType.Given);
      const hist: HistEntry = [];

      for (const cell of toBeCleared) {
        const newCell = _clearCell(state.board[cell]);
        hist.push([cell, state.board[cell], newCell]);
        state.board[cell] = newCell;
      }

      state.history = state.history.slice(0, state.historyIx);
      state.history.push(hist);
      state.historyIx = state.history.length;
    },
    setCells: (state, action: PayloadAction<SetCellsPayload>) => {
      const toBeSet = action.payload.ixs.filter(c => state.board[c].kind !== CellType.Given);
      const hist: HistEntry = [];

      for (const cell of toBeSet) {
        const newCell = _setCell(action.payload.mode, state.board[cell], action.payload.value);
        hist.push([cell, state.board[cell], newCell]);
        state.board[cell] = newCell;
      }

      state.history = state.history.slice(0, state.historyIx);
      state.history.push(hist);
      state.historyIx = state.history.length;
    },
    undo: (state) => {
      // Is there any more history to undo?
      if (state.historyIx === 0)
        return;

      state.historyIx--;

      for (const [ix, cell, _] of state.history[state.historyIx]) {
        state.board[ix] = cell;
      }
    },
    redo: (state) => {
      // Is there any more history to redo?
      if (state.historyIx === state.history.length)
        return;

      for (const [ix, _, cell] of state.history[state.historyIx]) {
        state.board[ix] = cell;
      }

      state.historyIx++;
    },
  },
});

export const {
  setupBoard,
  clearCells,
  setCells,
  undo,
  redo,
} = boardSlice.actions;

export const boardReducer = boardSlice.reducer;
