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

  // NOTE using a div here instead of a button because the default button
  // behavior wrt focus messes with using space to change between entry modes
  // This is obviously bad for accessibility
  // TODO improve accessibility here (aria or find alt fix for button focus)
  return (
    <div
      className={ classes }
      onClick={ onClick }
    >
      { label }
    </div>
  );
}

