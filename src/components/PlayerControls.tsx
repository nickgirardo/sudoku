import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';

import { setMode } from '../store/modeSlice';
import { setCells, clearCells, undo, redo } from '../store/boardSlice';
import { EntryMode } from '../@types/sudoku';

import { assertNever } from '../util';
import { checkSolution } from '../util/checkers';

import { ValidModal } from './modals/ValidModal';
import { InvalidModal } from './modals/InvalidModal';
import { InProgressModal } from './modals/InProgressModal';
import { Button } from './Button';

export const Controls = () => {
  const dispatch = useAppDispatch();

  const entryMode = useSelector((state: RootState) => state.mode.current);
  const board = useSelector((state: RootState) => state.board.board);
  const selectedCells = useSelector((state: RootState) => state.selected);

  const [showValidModal, setShowValidModal] = useState(false);
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [showInProgressModal, setShowInProgressModal] = useState(false);

  const numberEntry = (value: number) =>
    dispatch(setCells({ ixs: selectedCells, value, mode: entryMode }));

  const showBoardCheckModal = () => {
    const result = checkSolution(board);

    switch (result) {
      case 'complete':
        setShowValidModal(true);
        break;
      case 'in-progress':
        // todo
        setShowInProgressModal(true);
        break;
      case 'error':
        setShowInvalidModal(true);
        break;
      default:
        assertNever(result);
    }
  };

  return (
    <div className='controls player-controls'>
      <ValidModal
        isOpen={ showValidModal }
        closeHandler={ () => setShowValidModal(false) }
      />
      <InvalidModal
        isOpen={ showInvalidModal }
        closeHandler={ () => setShowInvalidModal(false) }
      />
      <InProgressModal
        isOpen={ showInProgressModal }
        closeHandler={ () => setShowInProgressModal(false) }
      />
      <Button
        label='Value'
        active={ entryMode === EntryMode.Value }
        onClick={ () => dispatch(setMode(EntryMode.Value)) }
      />
      <Button
        label='Corner'
        active={ entryMode === EntryMode.Corner }
        onClick={ () => dispatch(setMode(EntryMode.Corner)) }
      />
      <Button
        label='Center'
        active={ entryMode === EntryMode.Center }
        onClick={ () => dispatch(setMode(EntryMode.Center)) }
      />
      <div className='keypad'>
        <Button
          label='1'
          onClick={ () => numberEntry(1) }
        />
        <Button
          label='2'
          onClick={ () => numberEntry(2) }
        />
        <Button
          label='3'
          onClick={ () => numberEntry(3) }
        />
        <Button
          label='4'
          onClick={ () => numberEntry(4) }
        />
        <Button
          label='5'
          onClick={ () => numberEntry(5) }
        />
        <Button
          label='6'
          onClick={ () => numberEntry(6) }
        />
        <Button
          label='7'
          onClick={ () => numberEntry(7) }
        />
        <Button
          label='8'
          onClick={ () => numberEntry(8) }
        />
        <Button
          label='9'
          onClick={ () => numberEntry(9) }
        />
        <Button
          label='Clear'
          onClick={ () => dispatch(clearCells(selectedCells)) }
        />
      </div>
      <Button
        label='Undo'
        onClick={ () => dispatch(undo()) }
      />
      <Button
        label='Redo'
        onClick={ () => dispatch(redo()) }
      />
      <Button
        label='Check'
        onClick={ showBoardCheckModal }
      />
    </div>
  );
};
