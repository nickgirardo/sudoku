import {
  EmptyValue,
  SetValue,
  Cell,
} from '../@types/sudoku';

import {
  BOARD_WIDTH,
} from '../constants';

export const emptyValue = (): EmptyValue => ({
  kind: 'empty',
});

export const emptyCell = (): Cell => ({
  value: emptyValue(),
});

export const setValue = (value: number): SetValue => ({
  kind: 'set',
  value,
});

export const valueCell = (value: number): Cell => ({
  value: setValue(value),
});

export const getIndex = (x: number, y: number): number =>
  (y * BOARD_WIDTH) + x;

