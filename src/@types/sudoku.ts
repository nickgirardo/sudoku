export type CellIndex = number;

export type SetValue = {
  kind: 'set';
  value: number;
}
export type EmptyValue = {
  kind: 'empty';
}

export type CellValue = SetValue | EmptyValue;

export type Cell = { given: CellValue, value: CellValue };

export enum EntryMode {
  Value,
  Corner,
  Center,
};
