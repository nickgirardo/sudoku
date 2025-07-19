import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';

import { setMode } from '../store/modeSlice';
import { setCells, clearCells, undo, redo } from '../store/boardSlice';
import { EntryMode, UniquenessCheckResult } from '../@types/sudoku';

import { assertNever } from '../util';
import { checkUniqelySolvable } from '../util/checkers';

import { ShareModal } from './modals/ShareModal';
import { NotUniqModal } from './modals/NotUniqModal';
import { NoSolnModal } from './modals/NoSolnModal';
import { UniqSolnModal } from './modals/UniqSolnModal';
import { Button } from './Button';

export const Controls = () => {
  const dispatch = useAppDispatch();

  const entryMode = useSelector((state: RootState) => state.mode.current);
  const selectedCells = useSelector((state: RootState) => state.selected);
  const board = useSelector((state: RootState) => state.board.board);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState<UniquenessCheckResult | false>(false);

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
        onClick={ () => setShowCheckModal(checkUniqelySolvable(board)) }
      />
      <Button
        label='Share'
        onClick={ () => setShowShareModal(true) }
      />
    </div>
  );
};
