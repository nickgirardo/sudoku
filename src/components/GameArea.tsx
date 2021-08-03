import { useState, MouseEvent, KeyboardEvent } from 'react';
import { useSelector } from 'react-redux';

import { uniq } from 'lodash';

import { RootState, useAppDispatch } from '../store';
import { selectCell, deselectAll } from '../store/selectedSlice';
import { clearCells, setCells } from '../store/boardSlice';
import { nextMode } from '../store/modeSlice';

import { Controls } from './Controls';
import { Board } from './Board';
import { Cell } from './Cell';

export const GameArea = () => {
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

  const containerDown = (ev: MouseEvent) => {
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
    if (ev.key === ' ')
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
      cell={ c }
      isSelected={ selectedCells.includes(ix) }
      handleMouseDown={ () => cellDown(ix) }
      handleMouseOver={ () => cellOver(ix) }
    />
  );

  return (
    <div
      className='game-area'
      onMouseUp={ () => setSelectActive(false) }
      onMouseDown={ ev => containerDown(ev) }
      onKeyDown={ ev => keyDown(ev) }
      tabIndex={ 0 }
    >
      <Board>
        { cells }
      </Board>
      <Controls />
    </div>
  );
}
