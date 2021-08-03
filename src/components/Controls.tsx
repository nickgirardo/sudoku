import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';

import { setMode } from '../store/modeSlice';
import { setCells, clearCells } from '../store/boardSlice';
import { EntryMode } from '../@types/sudoku';

interface ButtonProps {
  label: string,
  active?: boolean,
  onClick: () => void,
}

const ControlButton = ({ active, label, onClick }: ButtonProps) => {
  const classes = classnames(
    'button',
    active && 'button-active',
    `button-${label.toLowerCase()}`,
  );

  return (
    <button className={ classes } onClick={ onClick }>
      { label }
    </button>
  );
}

export const Controls = () => {
  const dispatch = useAppDispatch();

  // TODO why is the type coercion needed here
  const entryMode = useSelector<RootState>(state => state.mode) as EntryMode;
  const selectedCells = useSelector<RootState>(state => state.selected) as Array<number>;

  const numberEntry = (value: number) =>
    dispatch(setCells({ ixs: selectedCells, value, mode: entryMode }));

  return (
    <div className='controls'>
      <ControlButton
        label='Value'
        active={ entryMode === EntryMode.Value }
        onClick={() => dispatch(setMode(EntryMode.Value)) }
      />
      <ControlButton
        label='Corner'
        active={ entryMode === EntryMode.Corner }
        onClick={() => dispatch(setMode(EntryMode.Corner)) }
      />
      <ControlButton
        label='Center'
        active={ entryMode === EntryMode.Center }
        onClick={() => dispatch(setMode(EntryMode.Center)) }
      />
      <div className='keypad'>
        <ControlButton
          label='1'
          onClick={() => numberEntry(1) }
        />
        <ControlButton
          label='2'
          onClick={() => numberEntry(2) }
        />
        <ControlButton
          label='3'
          onClick={() => numberEntry(3) }
        />
        <ControlButton
          label='4'
          onClick={() => numberEntry(4) }
        />
        <ControlButton
          label='5'
          onClick={() => numberEntry(5) }
        />
        <ControlButton
          label='6'
          onClick={() => numberEntry(6) }
        />
        <ControlButton
          label='7'
          onClick={() => numberEntry(7) }
        />
        <ControlButton
          label='8'
          onClick={() => numberEntry(8) }
        />
        <ControlButton
          label='9'
          onClick={() => numberEntry(9) }
        />
        <ControlButton
          label='Clear'
          onClick={() => dispatch(clearCells(selectedCells)) }
        />
      </div>
      <ControlButton
        label='Undo'
        onClick={() => {/* TODO */} }
      />
      <ControlButton
        label='Redo'
        onClick={() => {/* TODO */} }
      />
      <ControlButton
        label='Check'
        onClick={() => {/* TODO */} }
      />
    </div>
  );
};
