import type { Page } from '@/game/types';

export function PageCard(props: {
  page: Page;
  divProps?: React.HTMLProps<HTMLDivElement>;
}) {
  const { page, divProps } = props;

  return (
    <div
      {...divProps}
      className="flex flex-row items-center w-full max-w-md gap-2 p-2 rounded-lg bg-neutral-100"
    >
      <img
        className="w-16 h-16 rounded-lg object-cover"
        src={page.imageSrc || undefined}
        alt={page.imageAlt}
      />
      <p className="text-neutral-800">{page.title}</p>
    </div>
  );
}
