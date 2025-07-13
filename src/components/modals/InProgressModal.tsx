import { MouseEvent } from 'react';
import Modal, { Props as ReactModalProps } from 'react-modal';

import { Button } from '../Button';

interface OwnProps {
  closeHandler: (ev: MouseEvent) => void,
}
type Props = OwnProps & ReactModalProps;

export const InProgressModal = (props:Props) => {
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
      <h2 className='modal-title'>So far, so good!</h2>
      <p>This solution is looking good so far, keep up the good work!</p>
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
