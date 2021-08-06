import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';

import { setMode } from '../store/modeSlice';
import { setCells, clearCells } from '../store/boardSlice';
import { EntryMode } from '../@types/sudoku';

import { UnimplementedModal } from './UnimplementedModal';
import { Button } from './Button';

export const Controls = () => {
  const dispatch = useAppDispatch();

  const entryMode = useSelector((state: RootState) => state.mode);
  const selectedCells = useSelector((state: RootState) => state.selected);

  // If this not null, show the modal for the set feature
  const [showModalFor, setShowModalFor] = useState<string | null>(null);

  const numberEntry = (value: number) =>
    dispatch(setCells({ ixs: selectedCells, value, mode: entryMode }));

  return (
    <div className='controls player-controls'>
      <UnimplementedModal
        isOpen={ Boolean(showModalFor) }
        closeHandler={ () => setShowModalFor(null) }
        featureName={ showModalFor || '' }
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
        onClick={ () => setShowModalFor('undo') }
      />
      <Button
        label='Redo'
        onClick={ () => setShowModalFor('redo') }
      />
      <Button
        label='Check'
        onClick={ () => setShowModalFor('checking this puzzle for mistakes') }
      />
    </div>
  );
};
