import {
  CellType,
  EntryMode,
  Cell,
  GivenCell,
  ValueCell,
  MarkCell,
} from '../@types/sudoku';

import { uniq } from 'lodash';

// Use this function to make sure that a value is never possible
// Especially usefull with switches and enums
export const assertNever = (x: never): never => {
  throw new Error(`Unexpected: ${x}`);
};

export const boardValues = (board: Array<Cell>): Array<[number, number]> => {
  const result:Array<[number, number]> = [];
  for (const [ix, cell] of board.entries()) {
    if (cell.kind === CellType.Given || cell.kind === CellType.Value) {
      result.push([ix, cell.value]);
    }
  }
  return result;
};

// TODO maybe return a type with the kind of check result
// TODO this should be better tested
export const checkBoard = (board: Array<Cell>): boolean => {
  const inRow = (row: number, ix: number): boolean =>
    Math.floor(ix / 9) === row;

  const inColumn = (column: number, ix: number): boolean =>
    ix % 9 === column;

  // TODO This isn't particularly efficient
  const inBox = (box: number, ix: number): boolean => {
    // Boxes arranged as
    // 0 1 2
    // 3 4 5
    // 6 7 8
    const boxCol = box % 3;
    const boxRow = Math.floor(box / 3);
    const cellCol = Math.floor((ix % 9) / 3);
    const cellRow = Math.floor(ix / 27);

    return (cellCol === boxCol) && (cellRow === boxRow);
  };

  const cellValue = (cell: Cell): number => {
    // Since we check above if any cells are Mark
    // this case should never be reached
    if (cell.kind === CellType.Mark)
      return 0;
    return cell.value;
  };

  const cellsUnique = (cells: Array<Cell>): boolean => {
    const values = cells.map(cellValue);
    // All repeated elements are filtered by uniq
    // If the length of the array is unchanged all entries were unique
    return uniq(values).length === values.length;
  };

  // Just hardcoding this because it's short enough that I don't care
  // JS needs a range operator :(
  const range = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  // If any cell is Mark that means it isn't a Value or Given
  // A board cannot be solved if its cells are not all entered
  if (board.some(c => c.kind === CellType.Mark))
    return false;

  return (
    // Check that the columns are unique
    range.every(r => cellsUnique(board.filter((c, ix) => inColumn(r, ix)))) &&
    // Check that the rows are unique
    range.every(r => cellsUnique(board.filter((c, ix) => inRow(r, ix)))) &&
    // Check that the boxes are unique
    range.every(r => cellsUnique(board.filter((c, ix) => inBox(r, ix))))
  );
};

export const relativeToAbsolute = (url: string): string =>
  new URL(url, document.baseURI).href;

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

export const setCell = (mode: EntryMode, cell: Cell, value: number): Cell => {
  switch (mode) {
    case EntryMode.Value:
      return setCellValue(cell, value);
    case EntryMode.Corner:
      return setCellCorner(cell, value);
    case EntryMode.Center:
      return setCellCenter(cell, value);
    default:
      return assertNever(mode);
  }
};

const setCellValue = (cell: Cell, value: number): Cell => {
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

const setCellCorner = (cell: Cell, mark: number): Cell => {
  switch (cell.kind) {
    // NOP -- Marks don't matter for given cells
    case CellType.Given:
      return cell;
    // Change the corner mark for the cell
    // TODO this change isn't immediately visible, should it be ignored?
    case CellType.Value: {
      const corners = cell.cornerMarks.includes(mark) ?
        cell.cornerMarks.filter(m => m !== mark) :
        [mark, ...cell.cornerMarks].sort();
      return newValueCell(cell.value, corners, cell.centerMarks);
    }
    // Promote self to a value cell
    case CellType.Mark: {
      const corners = cell.cornerMarks.includes(mark) ?
        cell.cornerMarks.filter(m => m !== mark) :
        [mark, ...cell.cornerMarks].sort();
      return newMarkCell(corners, cell.centerMarks);
    }
    default:
      return assertNever(cell);
  }
};

const setCellCenter = (cell: Cell, mark: number): Cell => {
  switch (cell.kind) {
    // NOP -- Marks don't matter for given cells
    case CellType.Given:
      return cell;
    // Change the center marks for the cell
    // TODO this change isn't immediately visible, should it be ignored?
    case CellType.Value: {
      const centers = cell.centerMarks.includes(mark) ?
        cell.centerMarks.filter(m => m !== mark) :
        [mark, ...cell.centerMarks].sort();
      return newValueCell(cell.value, cell.cornerMarks, centers);
    }
    // Promote self to a value cell
    case CellType.Mark: {
      const centers = cell.centerMarks.includes(mark) ?
        cell.centerMarks.filter(m => m !== mark) :
        [mark, ...cell.centerMarks].sort();
      return newMarkCell(cell.cornerMarks, centers);
    }
    default:
      return assertNever(cell);
  }
};
