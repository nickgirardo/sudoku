import {
  ReactElement,
  useState,
  MouseEvent,
  TouchEvent,
  KeyboardEvent
} from 'react';
import { useSelector } from 'react-redux';

import { uniq } from 'lodash';

import { RootState, useAppDispatch } from '../store';
import { selectCell, deselectAll } from '../store/selectedSlice';
import { clearCells, setCells } from '../store/boardSlice';
import { nextMode } from '../store/modeSlice';

import { Controls } from './PlayerControls';
import { Board } from './Board';
import { Cell } from './Cell';

interface Props {
  children: ReactElement;
  builder?: boolean;
}

export const GameArea = ({ children, builder }: Props): ReactElement => {
  const dispatch = useAppDispatch();
  const board = useSelector((state: RootState) => state.board);
  const entryMode = useSelector((state: RootState) => state.mode);
  const selectedCells = useSelector((state: RootState) => state.selected);

  const [selectActive, setSelectActive] = useState(false);

  const cellDown = (ix: number) => {
    setSelectActive(true);
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

    // Advance the entry mode
    if (!builder && ev.key === ' ')
      dispatch(nextMode());

    // Undo
    if (ev.key === 'u') {
      // TODO undo behavior
    }

    // Redo
    if (ev.key === 'r') {
      // TODO redo behavior
    }
  };

  const cells = board.map((c, ix) =>
    <Cell
      key={ ix }
      ix={ ix }
      cell={ c }
      isSelected={ selectedCells.includes(ix) }
      handleMouseDown={ () => cellDown(ix) }
      handleMouseOver={ () => cellOver(ix) }
      handleTouchMove={ (ev: TouchEvent) => cellTouchMove(ev) }
      builder={ builder }
    />
  );

  return (
    <div
      className='game-area'
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
