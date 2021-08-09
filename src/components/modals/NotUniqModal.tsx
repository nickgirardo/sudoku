import { MouseEvent } from 'react';
import Modal, { Props as ReactModalProps } from 'react-modal';

import { Button } from '../Button';

interface OwnProps {
  closeHandler: (arg0: MouseEvent) => void,
}
type Props = OwnProps & ReactModalProps;

export const NotUniqModal = (props:Props) => {
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
      <h2 className='modal-title'>Not Unique</h2>
      <p>This puzzle has multiple unique solutions.  Try adding some more values to further constrain it.</p>
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
