import { type JSX, useEffect, useState } from 'react';

type Transformation = {
  x: number;
  y: number;
  rotation: number;
};

type Props = {
  ids: string[];
  renderCard: (id: string) => JSX.Element;
  zIndexOffset?: number;
};

const MAX_TRANSLATE_OFFSET = 4;
const MAX_ROTATION_OFFSET = 2;

export function MessyCardStack(props: Props) {
  const { ids, renderCard, zIndexOffset = 0 } = props;

  const [transforms, setTransforms] = useState<Record<string, Transformation>>(
    {},
  );

  useEffect(() => {
    const missingIds = ids.filter((id) => !transforms[id]);
    if (missingIds.length === 0) return;

    const newTransforms: Record<string, Transformation> = {};

    for (const id of missingIds) {
      const x =
        Math.random() * (MAX_TRANSLATE_OFFSET * 2) - MAX_TRANSLATE_OFFSET;
      const y =
        Math.random() * (MAX_TRANSLATE_OFFSET * 2) - MAX_TRANSLATE_OFFSET;
      const rotation =
        Math.random() * (MAX_ROTATION_OFFSET * 2) - MAX_ROTATION_OFFSET;

      newTransforms[id] = { x, y, rotation };
    }

    setTransforms((prev) => ({
      ...prev,
      ...newTransforms,
    }));
  }, [ids, transforms]);

  return (
    <div className="messy-card-stack">
      {ids.map((id) => {
        const { x, y, rotation } = transforms[id] || {
          x: 0,
          y: 0,
          rotation: 0,
        };

        return (
          <div
            key={id}
            className="messy-card-stack__wrapper"
            style={{
              zIndex: ids.length - ids.indexOf(id) + zIndexOffset,
              transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
            }}
          >
            {renderCard(id)}
          </div>
        );
      })}
    </div>
  );
}
