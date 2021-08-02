import { ReactNode, ReactElement } from 'react';

interface Props {
  children: ReactNode,
}

export const Board = ({ children }: Props): ReactElement => (
  <div className='board-container'>
    <div className='board'>
      { children }
    </div>
  </div>
);
