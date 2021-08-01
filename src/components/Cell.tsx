import classnames from 'classnames';

import { CellValue } from '../@types/sudoku';

interface Props {
  value: CellValue,
  isSelected: boolean,
  handleMouseDown: () => void,
  handleMouseOver: () => void,
}

export const Cell = (props: Props) => (
  <div
    className={ classnames('cell', props.value.kind === 'empty' && 'cell-empty') }
    onMouseDown={ props.handleMouseDown }
    onMouseOver={ props.handleMouseOver }
  >
    <div
      className={ classnames('cell-inner', props.isSelected && 'cell-inner-selected') }
    >
      { props.value.kind === 'set' && props.value.value }
    </div>
  </div>
);

