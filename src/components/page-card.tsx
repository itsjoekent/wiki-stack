import type { Page } from '@/game/types';

export function PageCard(props: {
  page: Page;
  divProps?: React.HTMLProps<HTMLDivElement>;
}) {
  const { page, divProps } = props;

  return (
    <div {...divProps} className="card page-card">
      {page.imageSrc && <img src={page.imageSrc} alt={page.imageAlt} />}
      <p className="page-card-title">{page.title}</p>
    </div>
  );
}
