import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import {
  assertNever,
  uniq,
  fromRowCol,
  toRowCol,
} from '../util';

export enum MoveDir {
  Up,
  Down,
  Left,
  Right,
}

const move = (r: number, c: number, dir: MoveDir): [number, number] => {
  switch (dir) {
    case MoveDir.Up:
      return [r, (c + 8) % 9];
    case MoveDir.Down:
      return [r, (c + 1) % 9];
    case MoveDir.Left:
      return [(r + 8) % 9, c];
    case MoveDir.Right:
      return [(r + 1) % 9, c];
    default:
      return assertNever(dir);
  }
}

export const selectedSlice = createSlice({
  name: 'selected',
  initialState: [] as Array<number>,
  reducers: {
    deselectAll: (state) => [],
    selectCell: (state, action: PayloadAction<number>) =>
      state = uniq([action.payload, ...state]),
    moveSelection: (state, action: PayloadAction<MoveDir>) => {
      // Cannot move the selection if there is no selection
      if (state.length === 0)
        return;

      // Most recent new entry as current selection point
      const currSelection = state[0];

      const [currRow, currCol] = toRowCol(currSelection);

      const [row, col] = move(currRow, currCol, action.payload);

      return [fromRowCol(row, col)];
    },
    moveAddToSelection: (state, action: PayloadAction<MoveDir>) => {
      // Cannot move the selection if there is no selection
      if (state.length === 0)
        return;

      // Most recent new entry as current selection point
      const currSelection = state[0];

      const [currRow, currCol] = toRowCol(currSelection);

      const [row, col] = move(currRow, currCol, action.payload);

      const newCell = fromRowCol(row, col);

      // If the cell we're moving to is already selected, don't change anything
      if (state.includes(newCell))
        return;

      return [newCell, ...state];
    },
  },
});

export const {
  selectCell,
  deselectAll,
  moveSelection,
  moveAddToSelection,
} = selectedSlice.actions;

export const selectedReducer = selectedSlice.reducer;

