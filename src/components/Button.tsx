import classnames from 'classnames';

interface Props {
  label: string,
  active?: boolean,
  onClick: () => void,
}

export const Button = ({ active, label, onClick }: Props) => {
  const classes = classnames(
    'button',
    active && 'button-active',
    `button-${label.toLowerCase()}`,
  );

  return (
    <button className={ classes } onClick={ onClick }>
      { label }
    </button>
  );
}

