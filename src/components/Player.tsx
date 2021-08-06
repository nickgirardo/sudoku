import { decodeBoard } from '../decode';
import { encodeBoard } from '../encode';
import { useAppDispatch } from '../store';
import { setupBoard } from '../store/boardSlice';

import { GameArea } from './GameArea';
import { Controls } from './PlayerControls';

export const Player = () => {
  const dispatch = useAppDispatch();

  const urlParams = new URLSearchParams(location.search);
  const boardParam = urlParams.get('play');

  if (boardParam) {
    const board = decodeBoard(boardParam);
    if (board) {
      dispatch(setupBoard(board));
    }
    // TODO else show warning message
  }

  return (
    <GameArea className='player'>
      <Controls />
    </GameArea>
  );
}
