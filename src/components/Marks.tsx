
interface Props {
  corners: Array<number>,
  centers: Array<number>,
  isValid: (n: number) => boolean,
}

export const Marks = ({ corners, centers, isValid }: Props) => {
  const cls = (n: number) => isValid(n) ? '' : 'invalid';

  return <>
    <div className='corners'>{ corners.map(c => <div key={ c } className={ cls(c) }>{ c }</div>) }</div>
    <div className='centers'>{ centers.map(c => <span key={ c } className={ cls(c) }>{ c }</span>) }</div>
  </>;
};
