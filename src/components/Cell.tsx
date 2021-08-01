import { CellValue } from '../@types/sudoku';

interface Props {
  value: CellValue,
  isSelected: boolean,
  handleMouseDown: () => void,
  handleMouseOver: () => void,
}

export const Cell = (props: Props) => (
  <div
    className='cell'
    onMouseDown={ props.handleMouseDown }
    onMouseOver={ props.handleMouseOver }
  >
    <div
      className={ ['cell-inner', props.isSelected ? 'cell-inner-selected' : ''].join(' ') }
    >
      { props.value.kind === 'empty' ? '-' : props.value.value }
    </div>
  </div>
);

