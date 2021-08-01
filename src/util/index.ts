// Use this function to make sure that a value is never possible
// Especially usefull with switches and enums
export const assertNever = (x: never): never => {
  throw new Error(`Unexpected: ${x}`);
}

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
  given: emptyValue(),
});

export const setValue = (value: number): SetValue => ({
  kind: 'set',
  value,
});

export const valueCell = (value: number): Cell => ({
  value: setValue(value),
  given: emptyValue(),
});

export const givenCell = (value: number): Cell => ({
  value: emptyValue(),
  given: setValue(value),
});

