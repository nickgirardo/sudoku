import { SATSolution } from 'boolean-sat';
import {
  checkUniqelySolvable,
  _sudokuClauses,
  _solutionToClause,
} from './checkers';
import { newMarkCell, newValueCell } from './index'
import { Cell, UniquenessCheckResult } from '../@types/sudoku';

describe('checkUniqelySolvable', () => {
  describe('_sudokuClauses', () => {
    test('has expected length', () => {
      const length = _sudokuClauses([]).length;
      expect(length).toEqual(10287);
    });

    test('grows with board entries', () => {
      const startingLength = 10287;
      {
        const board: Array<[number, number]> = [];
        const length = _sudokuClauses(board).length;
        expect(length).toEqual(startingLength);
      }
      {
        const board: Array<[number, number]> = [[1, 1]];
        const length = _sudokuClauses(board).length;
        expect(length).toEqual(startingLength + board.length);
      }
      {
        const board: Array<[number, number]> = [[1, 1], [2, 2]];
        const length = _sudokuClauses(board).length;
        expect(length).toEqual(startingLength + board.length);
      }
    });
  });

  describe('_solutionToClause', () => {
    test('output length one less than input', () => {
      {
        const solution: SATSolution = [null];
        expect(_solutionToClause(solution).length).toEqual(solution.length - 1);
      }
      {
        const solution: SATSolution = [null, false];
        expect(_solutionToClause(solution).length).toEqual(solution.length - 1);
      }
      {
        const solution: SATSolution = [null, false, false, true, false, true];
        expect(_solutionToClause(solution).length).toEqual(solution.length - 1);
      }
    });
    test('negates inputs', () => {
      // NOTE false gives +i, true gives -i
      const solution: SATSolution = [null, false, false, true, false, true];
      expect(_solutionToClause(solution)).toEqual([1, 2, -3, 4, -5]);
    });
  });

  describe('checkUniqelySolvable', () => {
    test('empty boards are not uniquely solvable', () => {
      // We must first create a board
      // This board is completely empty
      const board = new Array(81).fill(0).map(() => newMarkCell()) as Array<Cell>;
      expect(checkUniqelySolvable(board)).toEqual(UniquenessCheckResult.NOT_UNIQUE);
    });
    test('boards with too few constraints are not uniquely solvable', () => {
      const board = new Array(81).fill(0).map(() => newMarkCell()) as Array<Cell>;
      board[0] = newValueCell(1);
      board[2] = newValueCell(2);
      board[7] = newValueCell(3);
      expect(checkUniqelySolvable(board)).toEqual(UniquenessCheckResult.NOT_UNIQUE);
    });
    test('boards with the repeated values in the same row are not solvable', () => {
      const board = new Array(81).fill(0).map(() => newMarkCell()) as Array<Cell>;
      board[2] = newValueCell(3);
      board[7] = newValueCell(3);
      expect(checkUniqelySolvable(board)).toEqual(UniquenessCheckResult.NO_SOLUTION);
    });
    test('boards with the repeated values in the same column are not solvable', () => {
      const board = new Array(81).fill(0).map(() => newMarkCell()) as Array<Cell>;
      board[2] = newValueCell(3);
      board[2 + 9*5] = newValueCell(3);
      expect(checkUniqelySolvable(board)).toEqual(UniquenessCheckResult.NO_SOLUTION);
    });
    test('boards with the repeated values in the same box are not solvable', () => {
      const board = new Array(81).fill(0).map(() => newMarkCell()) as Array<Cell>;
      board[2] = newValueCell(3);
      board[18] = newValueCell(3);
      expect(checkUniqelySolvable(board)).toEqual(UniquenessCheckResult.NO_SOLUTION);
    });
    test('well formed boards are uniquely solvable', () => {
      // Typing this board out by hand was a nightmare
      const board = new Array(81).fill(0).map(() => newMarkCell()) as Array<Cell>;
      board[1] = newValueCell(9);
      board[4] = newValueCell(6);
      board[8] = newValueCell(4);
      board[9] = newValueCell(3);
      board[10] = newValueCell(2);
      board[11] = newValueCell(8);
      board[14] = newValueCell(4);
      board[15] = newValueCell(5);
      board[22] = newValueCell(3);
      board[23] = newValueCell(9);
      board[26] = newValueCell(2);
      board[32] = newValueCell(5);
      board[34] = newValueCell(2);
      board[35] = newValueCell(8);
      board[38] = newValueCell(4);
      board[42] = newValueCell(6);
      board[45] = newValueCell(9);
      board[46] = newValueCell(8);
      board[48] = newValueCell(7);
      board[54] = newValueCell(1);
      board[57] = newValueCell(3);
      board[58] = newValueCell(9);
      board[65] = newValueCell(9);
      board[66] = newValueCell(4);
      board[69] = newValueCell(2);
      board[70] = newValueCell(7);
      board[71] = newValueCell(1);
      board[72] = newValueCell(6);
      board[76] = newValueCell(8);
      board[79] = newValueCell(9);
      expect(checkUniqelySolvable(board)).toEqual(UniquenessCheckResult.UNIQUE_SOLUTION);
    });
  });
});
