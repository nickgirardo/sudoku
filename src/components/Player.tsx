import { useState } from 'react';

import { decodeBoard } from '../decode';
import { encodeBoard } from '../encode';
import { useAppDispatch } from '../store';
import { setupBoard } from '../store/boardSlice';

import { Welcome } from './Welcome';
import { GameArea } from './GameArea';
import { Controls } from './PlayerControls';
import { CorruptModal } from './CorruptModal';

export const Player = () => {
  const dispatch = useAppDispatch();
  const [decodeFailed, setDecodeFailed] = useState(false);
  const [showCorruptModal, setShowCorruptModal] = useState(false);

  const urlParams = new URLSearchParams(location.search);
  const boardParam = urlParams.get('play');

  if (boardParam) {
    // Only attempt to decode if we haven't already failed
    // If attempting to decode were invariant it would loop forever on failure
    // as setting state causes a rererender which would attempt another decode
    if (!decodeFailed) {
      const board = decodeBoard(boardParam);
      if (board) {
        dispatch(setupBoard(board));
      } else {
        setShowCorruptModal(true);
        setDecodeFailed(true);
      }
    }

    return (
      <>
        <CorruptModal
          isOpen={ showCorruptModal }
          closeHandler={ () => setShowCorruptModal(false) }
        />
        <GameArea className='player'>
          <Controls />
        </GameArea>
      </>
    );
  }

  // TODO the player doesn't have a board string
  // Show a welcome message here, link to builder and some sample boards?
  return (
    <Welcome />
  );
}
