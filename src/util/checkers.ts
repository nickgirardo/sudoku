import {
  CellType,
  Cell,
} from '../@types/sudoku';

import { uniq } from 'lodash';

// TODO maybe return a type with the kind of check result
// TODO this should be better tested
export const checkSolution = (board: Array<Cell>): boolean => {
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


