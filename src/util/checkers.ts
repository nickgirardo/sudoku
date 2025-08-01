import {
  UniquenessCheckResult,
  CellType,
  Cell,
} from '../@types/sudoku';

import solveSat, { SATSolution } from 'boolean-sat';

import { uniq, boardValues } from './index';

// This generates all of the constraints of a basic sudoku puzzle
// Including one clause for each cell that is set
const sudokuClauses = (board: Array<[number, number]>): Array<Array<number>> => {
  let clauses = [];

  // Helper function to get the value number for a digit in a given cell
  const inCell = (digit: number, cell: number):number =>
    digit + cell*9;

  // JS has no proper range operator, but the following line works
  const cells: Array<number> = new Array(81).fill(0).map((_, ix) => ix);
  const range: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (const c of cells) {
    // This clause states that each cell must have some value
    clauses.push(range.map(d => inCell(d, c)));

    // These clauses state that each cell may not have multiple values
    for (const i of range) {
      for (const j of range.slice(i)) {
        clauses.push([-inCell(i, c), -inCell(j, c)]);
      }
    }

    const sameRow = (c1: number, c2: number) =>
      Math.floor(c1/9) === Math.floor(c2/9);

    const sameCol = (c1: number, c2: number) =>
      c1%9 === c2%9;

    const sameBox = (c1: number, c2: number) =>
      Math.floor(c1/27) === Math.floor(c2/27) &&
      Math.floor((c1%9)/3) === Math.floor((c2%9)/3)

    for (const c2 of cells.slice(c+1)) {
      // If they're current cell and the next are in the same row, column, or box
      // Make sure they don't contain the same value
      if (sameRow(c, c2) || sameCol(c, c2) || sameBox(c, c2)) {
        // If so, make sure they aren't the same digit values
        for (const d of range) {
          clauses.push([-inCell(d, c), -inCell(d, c2)]);
        }
      }
    }
  }

  // Add all of the user's set cells
  // These are just units
  for (const [cell, value] of board) {
    clauses.push([inCell(value, cell)]);
  }

  return clauses;
};

// Transforms a negated solution into a clause
// This is so when the solver is run a second time a different solution is guaranteed
const solutionToClause = (solution: SATSolution): Array<number> => {
  let newClause = [];
  // Starting the iterator at 1
  // The first element is always null
  for (let i = 1; i < solution.length; i++) {
    newClause.push(solution[i] ? -i : i);
  }
  return newClause;
};

export const checkUniqelySolvable = (board: Array<Cell>): UniquenessCheckResult => {
  // 81 cells, 9 bools per cell
  const size = 81*9;

  const clauses = sudokuClauses(boardValues(board));
  const solution = solveSat(size, clauses);
  if (!solution)
    return UniquenessCheckResult.NO_SOLUTION;

  // The past solution will now no longer be possible
  clauses.push(solutionToClause(solution));

  // Run the solver a second time
  const newSolution = solveSat(size, clauses);
  // No more solutions, this means the first solution we found was unique
  if (!newSolution)
    return UniquenessCheckResult.UNIQUE_SOLUTION;

  // We found a second solution, the puzzle is not uniquely solveable
  return UniquenessCheckResult.NOT_UNIQUE;
};

const solveSudoku = (board: Array<Cell>): boolean => {
  // 81 cells, 9 bools per cell
  const size = 81*9;

  const clauses = sudokuClauses(boardValues(board));
  return Boolean(solveSat(size, clauses));
};

// TODO this should be better tested
export const checkSolution = (board: Array<Cell>): 'complete' | 'in-progress' | 'error' => {
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
    return solveSudoku(board) ? 'in-progress' : 'error';

  return (
    // Check that the columns are unique
    range.every(r => cellsUnique(board.filter((c, ix) => inColumn(r, ix)))) &&
    // Check that the rows are unique
    range.every(r => cellsUnique(board.filter((c, ix) => inRow(r, ix)))) &&
    // Check that the boxes are unique
    range.every(r => cellsUnique(board.filter((c, ix) => inBox(r, ix))))
  ) ? 'complete' : 'error';
};

// Exporting these for testing purposes
export {
  sudokuClauses as _sudokuClauses,
  solutionToClause as _solutionToClause,
};
