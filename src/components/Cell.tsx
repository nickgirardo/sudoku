import classnames from 'classnames';

import { CellValue } from '../@types/sudoku';

interface Props {
  given: CellValue,
  value: CellValue,
  isSelected: boolean,
  handleMouseDown: () => void,
  handleMouseOver: () => void,
}

export const Cell = (props: Props) => {
  const innerClasses = classnames(
    'cell-inner',
    props.isSelected && 'cell-inner-selected',
    props.given.kind === 'set' && 'cell-inner-given',
  );


  return (
    <div
      className='cell'
      onMouseDown={ props.handleMouseDown }
      onMouseOver={ props.handleMouseOver }
    >
      <div
        className={ innerClasses }
      >
        {
          props.given.kind === 'set' ?
            props.given.value :
            props.value.kind === 'set' && props.value.value
        }
      </div>
    </div>
  );
};

