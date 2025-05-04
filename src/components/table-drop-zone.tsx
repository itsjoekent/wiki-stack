import { useDroppable } from '@dnd-kit/core';
import type { Page } from '@/game/types';
import classNames from 'classnames';

export function TableDropZone(props: { stackIndex: number, topOfStack: Page }) {
  const { stackIndex, topOfStack } = props;

  const { isOver, setNodeRef } = useDroppable({
    id: stackIndex.toString(),
  });

  const style = {
    color: isOver ? 'green' : undefined,
  };

  const conditionalClasses = classNames({
    'bg-emerald-200': isOver,
    'bg-neutral-200': !isOver,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${conditionalClasses} flex flex-row items-center w-full gap-2 p-4 rounded-lg inset-shadow-sm inset-shadow-neutral-800`}
      style={style}
    >
      <img
        className="w-16 h-16 rounded-lg object-cover"
        src={topOfStack.imageSrc || undefined}
        alt={topOfStack.imageAlt}
      />
      <p className="text-neutral-950">{topOfStack.title}</p>
    </div>
  );
}
