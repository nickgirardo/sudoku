export type CellIndex = number;

export enum CellType {
  Given,
  Value,
  Mark,
}

export type GivenCell = {
  kind: CellType.Given;
  value: number;
};

export type ValueCell = {
  kind: CellType.Value;
  value: number;
  cornerMarks: Array<number>;
  centerMarks: Array<number>;
};

export type MarkCell = {
  kind: CellType.Mark;
  cornerMarks: Array<number>;
  centerMarks: Array<number>;
};

export type Cell = GivenCell | ValueCell | MarkCell;

export enum EntryMode {
  Value,
  Corner,
  Center,
};
