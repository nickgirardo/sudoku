
interface Props {
  corners: number[],
  centers: number[],
}

export const Marks = ({ corners, centers }: Props) => <>
  <div className='corners'>{
    corners.map(c => <div>{ c }</div>)
  }</div>
  <div className='centers'>{ centers.join(' ') }</div>
</>;
