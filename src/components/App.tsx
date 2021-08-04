import { decodeBoard } from '../decode';
import { encodeBoard } from '../encode';
import { useAppDispatch } from '../store';
import { setupBoard } from '../store/boardSlice';

import { GameArea } from './GameArea';

export const App = () => {
  const dispatch = useAppDispatch();

  const urlParams = new URLSearchParams(location.search);

  const boardParam = urlParams.get('play');
  if (boardParam) {
    const board = decodeBoard(boardParam);
    if (board) {
      console.log(encodeBoard(board));
      dispatch(setupBoard(board));
    }
    // TODO else show warning message
  }

  return (
    <GameArea />
  );
}
