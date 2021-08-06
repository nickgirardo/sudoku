import { useAppDispatch } from '../store';
import { setValidModes } from '../store/modeSlice';

import { EntryMode } from '../@types/sudoku';

import { GameArea } from './GameArea';
import { Controls } from './BuilderControls';

export const Builder = () => {
  const dispatch = useAppDispatch();

  dispatch(setValidModes([EntryMode.Value]));

  return (
    <GameArea className='builder'>
      <Controls />
    </GameArea>
  );
};
