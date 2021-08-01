export type CellIndex = number;

export type SetValue = {
  kind: 'set';
  value: number;
}
export type EmptyValue = {
  kind: 'empty';
}

export type CellValue = SetValue | EmptyValue;

export type Cell = { value: CellValue };