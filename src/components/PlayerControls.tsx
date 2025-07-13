import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';

import { setMode } from '../store/modeSlice';
import { setCells, clearCells } from '../store/boardSlice';
import { EntryMode } from '../@types/sudoku';

import { assertNever } from '../util';
import { checkSolution } from '../util/checkers';

import { UnimplementedModal } from './modals/UnimplementedModal';
import { ValidModal } from './modals/ValidModal';
import { InvalidModal } from './modals/InvalidModal';
import { InProgressModal } from './modals/InProgressModal';
import { Button } from './Button';

enum UnimplFeature {
  None,
  UndoUnimplemented,
  RedoUnimplemented,
}

export const Controls = () => {
  const dispatch = useAppDispatch();

  const entryMode = useSelector((state: RootState) => state.mode.current);
  const board = useSelector((state: RootState) => state.board);
  const selectedCells = useSelector((state: RootState) => state.selected);

  const [showUnimplModal, setShowUnimplModal] = useState(UnimplFeature.None);
  const [showValidModal, setShowValidModal] = useState(false);
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [showInProgressModal, setShowInProgressModal] = useState(false);

  const numberEntry = (value: number) =>
    dispatch(setCells({ ixs: selectedCells, value, mode: entryMode }));

  const getFeatureName = (modal: UnimplFeature): string => {
    switch (modal) {
      case UnimplFeature.None:
        // This shouldn't occur
        // The modal will not be shown if None is set
        return '';
      case UnimplFeature.UndoUnimplemented:
        return 'undo';
      case UnimplFeature.RedoUnimplemented:
        return 'redo';
      default:
        return assertNever(modal);
    }
  };

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
      <UnimplementedModal
        isOpen={ showUnimplModal !== UnimplFeature.None }
        closeHandler={ () => setShowUnimplModal(UnimplFeature.None) }
        featureName={ getFeatureName(showUnimplModal) }
      />
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
        onClick={ () => setShowUnimplModal(UnimplFeature.UndoUnimplemented) }
      />
      <Button
        label='Redo'
        onClick={ () => setShowUnimplModal(UnimplFeature.RedoUnimplemented) }
      />
      <Button
        label='Check'
        onClick={ showBoardCheckModal }
      />
    </div>
  );
};
