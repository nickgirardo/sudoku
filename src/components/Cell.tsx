import classnames from 'classnames';

import { MouseEvent, TouchEvent } from 'react';
import { Cell as _Cell, CellType } from '../@types/sudoku';
import { assertNever } from '../util';

import { Marks } from './Marks';

interface Props {
  ix: number,
  cell: _Cell,
  isSelected: boolean,
  handleMouseDown: (arg0: MouseEvent | TouchEvent) => void,
  handleMouseOver: (arg0: MouseEvent) => void,
  handleTouchMove: (arg0: TouchEvent) => void,
  builder?: boolean,
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
      return <Marks corners={ cell.cornerMarks } centers={ cell.centerMarks } />
    default:
      return assertNever(cell);
  }
};

export const Cell = (props: Props) => {
  const innerClasses = classnames(
    'cell-inner',
    props.isSelected && 'cell-inner-selected',
    props.cell.kind === CellType.Given && 'cell-inner-given',
    props.builder && 'cell-inner-builder',
  );

  return (
    <div
      className='cell'
      data-index={ props.ix }
      onMouseDown={ props.handleMouseDown }
      onTouchStart={ props.handleMouseDown }
      onMouseOver={ props.handleMouseOver }
      onTouchMove={ props.handleTouchMove }
    >
      <div
        className={ innerClasses }
      >
        <Inner cell={ props.cell } />
      </div>
    </div>
  );
};

