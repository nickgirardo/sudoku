import {
  ReactElement,
  useState,
  MouseEvent,
  TouchEvent,
  KeyboardEvent
} from 'react';
import { useSelector } from 'react-redux';

import classnames from 'classnames';

import { RootState, useAppDispatch } from '../store';
import { clearCells, setCells, undo, redo } from '../store/boardSlice';
import { nextMode, prevMode } from '../store/modeSlice';
import {
  selectCell,
  deselectAll,
  moveSelection,
  moveAddToSelection,
  MoveDir,
} from '../store/selectedSlice';

import { Controls } from './PlayerControls';
import { Board } from './Board';
import { Cell } from './Cell';

import { CellType } from '../@types/sudoku';

interface Props {
  children: ReactElement;
  className?: string;
}

export const GameArea = ({ children, className }: Props): ReactElement => {
  const dispatch = useAppDispatch();
  const board = useSelector((state: RootState) => state.board.board);
  const entryMode = useSelector((state: RootState) => state.mode.current);
  const selectedCells = useSelector((state: RootState) => state.selected);

  const [selectActive, setSelectActive] = useState(false);

  // Cache of set values in the current board
  // All given and value cells are represented by their value
  // Mark cells (which are unset) are represented by negative one (not a valid digit of course)
  // This is helpful for speeding up some calculations, such as checking a digits trivial validity
  const boardValues = board.map(c => c.kind === CellType.Mark ? -1 : c.value);

  const cellDown = (ev: (MouseEvent | TouchEvent), ix: number) => {
    setSelectActive(true);

    // Don't reset the previous selections if shift is held down
    if (!ev.shiftKey)
      dispatch(deselectAll());

    dispatch(selectCell(ix));
  };

  const cellOver = (ix: number) => {
    if (!selectActive)
      return;

    dispatch(selectCell(ix));
  };

  // This is a bit janky
  // The touchmove event doesn't update the target as the mousemove does
  // event.target will always refer to the element which was originally touched
  // This isn't ideal, we'd prefer that the user can drag and grab a bunch of cells
  // To combat this, we find the elements under the current current touch position
  // and attempt to pick out the cell (the id of which we can find through its data)
  const cellTouchMove = (ev: TouchEvent) => {
    if (!selectActive)
      return;

    const touch = ev.touches.item(0);
    let el = document.elementFromPoint(touch.clientX, touch.clientY) as (HTMLElement | null);

    // Traverse up the chain of parents of the element under the point
    while (el) {
      // Have we found our cell yet?
      if (Array.from(el.classList).includes('cell')) {
        const index = el.dataset.index;
        dispatch(selectCell(Number(el.dataset.index)));
        return;
      }
      // If not, let's check its parent
      el = el.parentElement;
    }
  }

  const containerDown = (ev: MouseEvent | TouchEvent) => {
    // If we mouse down on (for instance) a cell which is a child of the container
    // we don't want to run the rest of this handler
    // This could also be handled by stopping the event propagation from within the cells
    // but that requires remembering to stop propagation for every relevant child
    if (ev.target !== ev.currentTarget)
      return;

    // Clicking on the container
    // We're no longer selecting, and we should unselect everything we had
    setSelectActive(false);
    dispatch(deselectAll());
  };

  const keyDown = (ev: KeyboardEvent) => {
    // Key is between 1...9
    // Enter the given value into the selected cells
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(ev.key)) {
      const digitValue = Number(ev.key);
      dispatch(setCells({ ixs: selectedCells, value: digitValue, mode: entryMode }));
    }

    // Clear current values from the selected cells
    if (ev.key === 'Backspace' || ev.key === 'Delete')
      dispatch(clearCells(selectedCells));

    // Switch to the next or previous entry mode
    if (ev.key === ' ')
      dispatch(ev.shiftKey ? prevMode() : nextMode());

    if (ev.key.startsWith('Arrow')) {
      const action = ev.shiftKey ? moveAddToSelection : moveSelection;

      const key = ev.key.slice(5);
      switch (key) {
        case 'Up':
          dispatch(action(MoveDir.Up));
          break;
        case 'Down':
          dispatch(action(MoveDir.Down));
          break;
        case 'Left':
          dispatch(action(MoveDir.Left));
          break;
        case 'Right':
          dispatch(action(MoveDir.Right));
          break;
        default:
          break;
      }
    }

    // Undo
    if (ev.key === 'z')
      dispatch(undo());

    // Redo
    if (ev.key === 'r')
      dispatch(redo());
  };

  // Check if a digit `n` at a given cell `ix` is trivially valid
  // This checks that the cell's row, column, or box do not have any of the same digit
  // This does not confirm that `n` is the correct digit for that box!
  const isValid = (ix: number, n: number): boolean => {
    const colRange = [0, 9, 18, 27, 36, 45, 54, 63, 72];
    const col = ix % 9;
    const colIndicies = colRange.map(n => col + n).filter(n => n !== ix);

    if (colIndicies.map(ix => boardValues[ix]).includes(n))
      return false;

    const rowRange = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const row = ix - col;
    const rowIndicies = rowRange.map(n => row + n).filter(n => n !== ix);

    if (rowIndicies.map(ix => boardValues[ix]).includes(n))
      return false;

    const boxRange = [0, 1, 2, 9, 10, 11, 18, 19, 20];
    const box = (Math.floor(col / 3) * 3) + (Math.floor(row / 27) * 27);
    const boxIndicies = boxRange.map(n => box + n).filter(n => n !== ix);


    return !boxIndicies.map(ix => boardValues[ix]).includes(n);
  };

  const cells = board.map((c, ix) =>
    <Cell
      key={ ix }
      ix={ ix }
      cell={ c }
      isSelected={ selectedCells.includes(ix) }
      handleMouseDown={ (ev: MouseEvent | TouchEvent) => cellDown(ev, ix) }
      handleMouseOver={ () => cellOver(ix) }
      handleTouchMove={ (ev: TouchEvent) => cellTouchMove(ev) }
      isValid={ (n: number) => isValid(ix, n) }
    />
  );

  return (
    <div
      className={ classnames('game-area', className) }
      onMouseUp={ () => setSelectActive(false) }
      onTouchEnd={ () => setSelectActive(false) }
      onMouseDown={ ev => containerDown(ev) }
      onTouchStart={ ev => containerDown(ev) }
      onKeyDown={ ev => keyDown(ev) }
      tabIndex={ 0 }
    >
      <Board>
        { cells }
      </Board>
      { children }
    </div>
  );
}
