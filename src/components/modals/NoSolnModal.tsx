import { MouseEvent } from 'react';
import Modal, { Props as ReactModalProps } from 'react-modal';

import { Button } from '../Button';

interface OwnProps {
  closeHandler: (arg0: MouseEvent) => void,
}
type Props = OwnProps & ReactModalProps;

export const NoSolnModal = (props:Props) => {
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
      <h2 className='modal-title'>No Solutions</h2>
      <p>There aren't any valid solutions to this puzzle.  You may have the reused the same number in a column, row, or box.</p>
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
