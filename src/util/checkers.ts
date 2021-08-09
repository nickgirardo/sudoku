import {
  UniquenessCheckResult,
  CellType,
  Cell,
} from '../@types/sudoku';

import { uniq } from 'lodash';
import solveSat, { SATSolution } from 'boolean-sat';

import { boardValues } from './index';

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
    let cellClause = [];
    for (const d of range) {
      cellClause.push(inCell(d, c));
    }
    clauses.push(cellClause);

    // These clauses state that each cell may not have multiple values
    for (const i of range) {
      for (const j of range.slice(i)) {
        clauses.push([-inCell(i, c), -inCell(j, c)]);
      }
    }

    // Row check
    for (const c2 of cells.slice(c+1)) {
      // Are they in the same row?
      // If not, let's move to the next cell
      if (Math.floor(c/9) !== Math.floor(c2/9))
        continue;

      // If so, make sure they aren't the same digit values
      for (const d of range) {
        clauses.push([-inCell(d, c), -inCell(d, c2)]);
      }
    }

    // Column check
    for (const c2 of cells.slice(c+1)) {
      // Are they in the same column?
      // If not, let's move to the next cell
      if (c%9 !== c2%9)
        continue;

      // If so, make sure they aren't the same digit values
      for (const d of range) {
        clauses.push([-inCell(d, c), -inCell(d, c2)]);
      }
    }

    // Box check
    for (const c2 of cells.slice(c+1)) {
      if (
        // Are they in the same row or the same column?
        // If so, we've already handled them
        // Adding them here would just duplicate existing clauses
        Math.floor(c/9) === Math.floor(c2/9) ||
        c%9 === c2%9 ||
        // Are they in the same box?
        // If not, let's move to the next cell
        Math.floor(c/27) !== Math.floor(c2/27) ||
        Math.floor((c%9)/3) !== Math.floor((c2%9)/3)
      )
        continue;

      // If so, make sure they aren't the same digit values
      for (const d of range) {
        clauses.push([-inCell(d, c), -inCell(d, c2)]);
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


