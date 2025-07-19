import classnames from 'classnames';

import { MouseEvent, TouchEvent } from 'react';
import { Cell as _Cell, CellType } from '../@types/sudoku';
import { assertNever } from '../util';

import { Marks } from './Marks';

interface Props {
  ix: number,
  cell: _Cell,
  isSelected: boolean,
  handleMouseDown: (ev: MouseEvent | TouchEvent) => void,
  handleMouseOver: (ev: MouseEvent) => void,
  handleTouchMove: (ev: TouchEvent) => void,
  isValid: (n: number) => boolean,
}

interface InnerProps {
  cell: _Cell,
  isValid: (n: number) => boolean,
}

export const Inner = ({ cell, isValid }: InnerProps) => {
  switch (cell.kind) {
    case CellType.Given:
      return <>{ cell.value }</>;
    case CellType.Value:
      return <>{ cell.value }</>;
    case CellType.Mark:
      return <Marks
        corners={ cell.cornerMarks }
        centers={ cell.centerMarks }
        isValid={ isValid }
      />
    default:
      return assertNever(cell);
  }
};

export const Cell = (props: Props) => {
  const innerClasses = classnames(
    'cell-inner',
    props.isSelected && 'cell-inner-selected',
    props.cell.kind === CellType.Given && 'cell-inner-given',
    props.cell.kind === CellType.Value && !props.isValid(props.cell.value) && 'cell-inner-invalid',
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
        <Inner cell={ props.cell } isValid={ props.isValid } />
      </div>
    </div>
  );
};

