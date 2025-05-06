import { type ReactNode } from 'react';
import classNames from 'classnames';

type Props = {
  children: ReactNode;
  isFlipped: boolean;
};

export function FlipCard(props: Props) {
  const { children, isFlipped } = props;

  const conditionalClasses = classNames({
    '--flipped': isFlipped,
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
