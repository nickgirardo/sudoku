import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

const BOARD_WIDTH = 9;
const BOARD_HEIGHT = 9;
const BOARD_SIZE = BOARD_WIDTH * BOARD_HEIGHT;

interface CellCoord {
  x: number,
  y: number,
};

type SetValue = {
  kind: 'set';
  value: number;
}
type EmptyValue = {
  kind: 'empty';
}

type Value = SetValue | EmptyValue;

type Cell = { value: Value };

const emptyValue: EmptyValue = {
  kind: 'empty',
};

const emptyCell: Cell = {
  value: emptyValue,
};

const getIndex = (x: number, y: number): number => 
  (y * BOARD_WIDTH) + x;

export const boardSlice = createSlice({
  name: 'board',
  initialState: new Array(BOARD_SIZE).fill(0).map(_ => emptyCell),
  reducers: {
    // TODO I shouldn't need to be handling the state like this
    // will try to find out why ts is complaining
    clearCell: (state, action: PayloadAction<CellCoord>) => {
      const newBoard = [...state];
      newBoard[getIndex(action.payload.x, action.payload.y)] = emptyCell;
      state = newBoard;
    },
    setValue: (state, action: PayloadAction<CellCoord & SetValue>) => {
      const newBoard = [...state];
      newBoard[getIndex(action.payload.x, action.payload.y)].value = { kind: 'set', value: action.payload.value } as Value;
      state = newBoard;
    },
  },
});
