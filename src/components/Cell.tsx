import classnames from 'classnames';

import { Cell as _Cell, CellType } from '../@types/sudoku';
import { assertNever } from '../util';

interface Props {
  cell: _Cell,
  isSelected: boolean,
  handleMouseDown: () => void,
  handleMouseOver: () => void,
}

interface InnerProps {
  cell: _Cell,
}

export const Inner = ({ cell }: InnerProps) => {
  switch (cell.kind) {
    case CellType.Given:
      return <>{ cell.value }</>;
    case CellType.Value:
      return <>{ cell.value }</>;
    case CellType.Mark:
      return <>{ /* TODO render marks here */ }</>;
    default:
      return assertNever(cell);
  }
};

export const Cell = (props: Props) => {
  const innerClasses = classnames(
    'cell-inner',
    props.isSelected && 'cell-inner-selected',
    props.cell.kind === CellType.Given && 'cell-inner-given',
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
        <Inner cell={ props.cell } />
      </div>
    </div>
  );
};

