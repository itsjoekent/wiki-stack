import type { Page } from '@/game/types';

export function PageCard(props: {
  page: Page;
  divProps?: React.HTMLProps<HTMLDivElement>;
}) {
  const { page, divProps } = props;

  return (
    <div {...divProps} className="card page-card">
      <img
        src={page.imageSrc || undefined}
        alt={page.imageAlt}
      />
      <p className="page-card-title">{page.title}</p>
    </div>
  );
}
