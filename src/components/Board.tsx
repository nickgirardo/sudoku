import { useState, MouseEvent, KeyboardEvent } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { clearCells, setCells } from '../store/boardSlice';

import { setValue } from '../util';
import { Cell } from './Cell';

export const Board = () => {
  const dispatch = useAppDispatch();
  const board = useSelector((state: RootState) => state.board);

  const [selectActive, setSelectActive] = useState(false);
  const [selectedCells, setSelectedCells] = useState([] as Array<number>);

  const cellDown = (ix: number) => {
    setSelectActive(true);
    setSelectedCells([ix]);
  };

  const cellOver = (ix: number) => {
    if (!selectActive)
      return;

    // TODO unique
    setSelectedCells([...selectedCells, ix]);
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
    setSelectedCells([]);
  };

  const keyDown = (ev: KeyboardEvent) => {
    // Key is between 1...9
    if (ev.keyCode > 48 && ev.keyCode < 58) {
      const digitValue = Number(ev.key);
      dispatch(setCells({ ixs: selectedCells, ...setValue(digitValue) }));
    }

    if (ev.key === 'Backspace' || ev.key === 'Delete')
      dispatch(clearCells(selectedCells));

    if (ev.keyCode === 85) {
      // TODO undo behavior
    }
  };

  const cells = board.map((c, ix) =>
    <Cell
      key={ ix }
      value={ c.value }
      isSelected={ selectedCells.includes(ix) }
      handleMouseDown={ () => cellDown(ix) }
      handleMouseOver={ () => cellOver(ix) }
    />
  );

  return (
    <div
      className='board-container'
      onMouseUp={ () => setSelectActive(false) }
      onMouseDown={ ev => containerDown(ev) }
      onKeyDown={ ev => keyDown(ev) }
      tabIndex={ 0 }
    >
      <div className='board'>
        { cells }
      </div>
    </div>
  );
}
