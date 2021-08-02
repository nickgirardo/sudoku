import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';

import { setMode } from '../store/modeSlice';
import { EntryMode } from '../@types/sudoku';

// TODO currently using disabled to show the current active mode
interface ButtonProps {
  label: string,
  disabled: boolean,
  onClick: () => void,
}

const ControlButton = (props: ButtonProps) => {
  return (
    <button disabled={ props.disabled } onClick={ props.onClick }>
      { props.label }
    </button>
  );
}

export const Controls = () => {
  const dispatch = useAppDispatch();
  const entryMode = useSelector<RootState>(state => state.mode);

  return (
    <div className='controls'>
      <ControlButton
        label='Value'
        disabled={ entryMode === EntryMode.Value }
        onClick={() => dispatch(setMode(EntryMode.Value)) }
      />
      <ControlButton
        label='Corner'
        disabled={ entryMode === EntryMode.Corner }
        onClick={() => dispatch(setMode(EntryMode.Corner)) }
      />
      <ControlButton
        label='Center'
        disabled={ entryMode === EntryMode.Center }
        onClick={() => dispatch(setMode(EntryMode.Center)) }
      />
    </div>
  );
};
