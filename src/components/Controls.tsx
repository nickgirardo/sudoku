import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';

import { setMode } from '../store/modeSlice';
import { setCells, clearCells } from '../store/boardSlice';
import { EntryMode } from '../@types/sudoku';

import { Button } from './Button';

export const Controls = () => {
  const dispatch = useAppDispatch();

  const entryMode = useSelector((state: RootState) => state.mode);
  const selectedCells = useSelector((state: RootState) => state.selected);

  const numberEntry = (value: number) =>
    dispatch(setCells({ ixs: selectedCells, value, mode: entryMode }));

  return (
    <div className='controls'>
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
        onClick={ () => {/* TODO */} }
      />
      <Button
        label='Redo'
        onClick={ () => {/* TODO */} }
      />
      <Button
        label='Check'
        onClick={ () => {/* TODO */} }
      />
    </div>
  );
};
