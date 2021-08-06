import { MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import Modal, { Props as ReactModalProps } from 'react-modal';

import { RootState } from '../store';

import { boardValues, relativeToAbsolute } from '../util';
import { encodeBoard } from '../encode';

import { Button } from './Button';

interface OwnProps {
  closeHandler: (arg0: MouseEvent) => void,
}
type Props = OwnProps & ReactModalProps;

export const ShareModal = (props:Props) => {
  const {
    closeHandler,
    ...reactModalProps
  } = props;

  const board = useSelector((state: RootState) => state.board);
  const values = boardValues(board);
  const encoded = encodeBoard(values);

  const playerLink = `player.html?play=${encoded}`;
  const absoluteLink = relativeToAbsolute(playerLink);

  const copyLink = () => {
    navigator.clipboard.writeText(absoluteLink);
  };

  // TODO the copy link button has no feedback right now
  return (
    <Modal
      className='modal'
      onRequestClose={ closeHandler }
      shouldCloseOnOverlayClick={ true }
      { ...reactModalProps }
    >
      <h2 className='modal-title'> Share Puzzle</h2>
      <p>
        Here is a link to your board:&nbsp;
        <a target='_blank' href={ playerLink }>{ absoluteLink }</a>
      </p>
      <p>
        If you want to copy this link, <a onClick={ copyLink }>click here</a>.
      </p>
      <div>
        <Button
          compact
          label='Close'
          onClick={ closeHandler }
        />
      </div>
    </Modal>
  );
};
