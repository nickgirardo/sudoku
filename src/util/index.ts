import {
  CellType,
  Cell,
  GivenCell,
  ValueCell,
  MarkCell,
} from '../@types/sudoku';

// Use this function to make sure that a value is never possible
// Especially usefull with switches and enums
export const assertNever = (x: never): never => {
  throw new Error(`Unexpected: ${x}`);
};

// Ideally these awkward functions would just be constructor methods
// However, redux complains about serializability when I make the cells class objects
export const newGivenCell = (value: number): GivenCell =>
  ({ kind: CellType.Given, value: value });

export const newValueCell = (value: number, corner?: number[], center?: number[]): ValueCell => ({
  kind: CellType.Value,
  value: value,
  cornerMarks: corner || [],
  centerMarks: center || [],
});

export const newMarkCell = (corner?: number[], center?: number[]): MarkCell => ({
  kind: CellType.Mark,
  cornerMarks: corner || [],
  centerMarks: center || [],
});

export const clearCell = (cell: Cell): Cell => {
  switch (cell.kind) {
    // NOP -- Given cells cannot be cleared
    case CellType.Given:
      return cell;
    // Become a mark cell and show the underlying marks
    case CellType.Value:
      return newMarkCell(cell.cornerMarks, cell.centerMarks);
    // Clear out all remaining marks
    case CellType.Mark:
      return newMarkCell();
    default:
      return assertNever(cell);
  }
};

export const setCellValue = (cell: Cell, value: number): Cell => {
  switch (cell.kind) {
    // NOP -- Given cells cannot have their values changed
    case CellType.Given:
      return cell;
    // Change the value of the cell
    case CellType.Value:
      return newValueCell(value, cell.cornerMarks, cell.centerMarks);
    // Promote self to a value cell
    case CellType.Mark:
      return newValueCell(value, cell.cornerMarks, cell.centerMarks);
    default:
      return assertNever(cell);
  }
};
