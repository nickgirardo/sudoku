import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';

import { setMode } from '../store/modeSlice';
import { setCells, clearCells } from '../store/boardSlice';
import { EntryMode, UniquenessCheckResult } from '../@types/sudoku';

import { assertNever } from '../util';
import { checkUniqelySolvable } from '../util/checkers';

import { ShareModal } from './modals/ShareModal';
import { NotUniqModal } from './modals/NotUniqModal';
import { NoSolnModal } from './modals/NoSolnModal';
import { UniqSolnModal } from './modals/UniqSolnModal';
import { UnimplementedModal } from './modals/UnimplementedModal';
import { Button } from './Button';

enum UnimplFeature {
  None,
  UndoUnimplemented,
  RedoUnimplemented,
}

export const Controls = () => {
  const dispatch = useAppDispatch();

  const entryMode = useSelector((state: RootState) => state.mode.current);
  const selectedCells = useSelector((state: RootState) => state.selected);
  const board = useSelector((state: RootState) => state.board);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState<UniquenessCheckResult | false>(false);
  const [showUnimplModal, setShowUnimplModal] = useState(UnimplFeature.None);

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

  const numberEntry = (value: number) =>
    dispatch(setCells({ ixs: selectedCells, value, mode: entryMode }));

  return (
    <div className='controls builder-controls'>
      <ShareModal
        isOpen={ showShareModal }
        closeHandler={ () => setShowShareModal(false) }
      />
      <NotUniqModal
        isOpen={ showCheckModal === UniquenessCheckResult.NOT_UNIQUE }
        closeHandler={ () => setShowCheckModal(false) }
      />
      <NoSolnModal
        isOpen={ showCheckModal === UniquenessCheckResult.NO_SOLUTION }
        closeHandler={ () => setShowCheckModal(false) }
      />
      <UniqSolnModal
        isOpen={ showCheckModal === UniquenessCheckResult.UNIQUE_SOLUTION }
        closeHandler={ () => setShowCheckModal(false) }
      />
      <UnimplementedModal
        isOpen={ showUnimplModal !== UnimplFeature.None }
        closeHandler={ () => setShowUnimplModal(UnimplFeature.None) }
        featureName={ getFeatureName(showUnimplModal) }
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
        onClick={ () => setShowCheckModal(checkUniqelySolvable(board)) }
      />
      <Button
        label='Share'
        onClick={ () => setShowShareModal(true) }
      />
    </div>
  );
};
