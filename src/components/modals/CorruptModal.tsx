import { MouseEvent } from 'react';
import Modal, { Props as ReactModalProps } from 'react-modal';

import { Button } from '../Button';

interface OwnProps {
  closeHandler: (arg0: MouseEvent) => void,
}
type Props = OwnProps & ReactModalProps;

export const CorruptModal = (props:Props) => {
  const {
    closeHandler,
    ...reactModalProps
  } = props;

  // TODO this isn't a very reassuring or calming error message
  return (
    <Modal
      className='modal'
      onRequestClose={ closeHandler }
      shouldCloseOnOverlayClick={ true }
      { ...reactModalProps }
    >
      <h2 className='modal-title'>Unable to load board</h2>
      <p>
        Something went wrong while attempting to load your board.
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

