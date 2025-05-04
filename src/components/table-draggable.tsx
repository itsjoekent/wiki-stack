import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Page } from '@/game/types';
import { PageCard } from './page-card';

export function TableDraggable(props: { page: Page }) {
  const { page } = props;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: page.url,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  if (!page) {
    return null;
  }

  return (
    <PageCard
      page={page}
      divProps={{
        ref: setNodeRef,
        style,
        ...listeners,
        ...attributes,
      }}
    />
  );
}
