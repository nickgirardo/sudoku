import { MouseEvent } from 'react';
import Modal, { Props as ReactModalProps } from 'react-modal';

import { Button } from '../Button';

interface OwnProps {
  closeHandler: (arg0: MouseEvent) => void,
}
type Props = OwnProps & ReactModalProps;

export const InvalidModal = (props:Props) => {
  const {
    closeHandler,
    ...reactModalProps
  } = props;

  return (
    <Modal
      className='modal'
      onRequestClose={ closeHandler }
      shouldCloseOnOverlayClick={ true }
      { ...reactModalProps }
    >
      <h2 className='modal-title'>Not quite</h2>
      <p>This doesn't look quite right to me, sorry :(</p>
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
