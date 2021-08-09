import { MouseEvent } from 'react';
import Modal, { Props as ReactModalProps } from 'react-modal';

import { Button } from '../Button';

interface OwnProps {
  closeHandler: (arg0: MouseEvent) => void,
}
type Props = OwnProps & ReactModalProps;

export const ValidModal = (props:Props) => {
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
      <h2 className='modal-title'>Looks good!</h2>
      <p>This solution looks good, nice work!</p>
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
