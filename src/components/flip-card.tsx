import { type ReactNode } from 'react';
import classNames from 'classnames';

type Props = {
  children: ReactNode;
  side: 'back' | 'front';
};

export function FlipCard(props: Props) {
  const { children, side } = props;

  const conditionalClasses = classNames({
    '--flipped': side === 'back',
  });

  return (
    <div className={`flip-card ${conditionalClasses}`}>
      <div className="flip-card-inner">
        <div className="flip-card-front">{children}</div>
        <div className="flip-card-back" />
      </div>
    </div>
  );
}
