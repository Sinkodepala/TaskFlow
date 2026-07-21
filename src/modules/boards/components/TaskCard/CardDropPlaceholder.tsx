import { useDroppable } from "@dnd-kit/core";
import type { UniqueIdentifier } from "@dnd-kit/core";

import type {
  CardInsertPosition,
  PlaceholderDragData,
} from "@/modules/boards/hooks/useBoardDnd";

import styles from "./CardDropPlaceholder.module.scss";

interface CardDropPlaceholderProps {
  columnId: string;
  anchorCardId?: UniqueIdentifier | null;
  insertPosition?: CardInsertPosition | null;
}

export const CardDropPlaceholder = ({
  columnId,
  anchorCardId = null,
  insertPosition = null,
}: CardDropPlaceholderProps) => {
  const { setNodeRef } = useDroppable({
    id: `drop-placeholder-${columnId}`,
    data: {
      type: "placeholder",
      columnId,
      anchorCardId,
      insertPosition,
    } satisfies PlaceholderDragData,
  });

  return (
    <div ref={setNodeRef} className={styles.placeholder} aria-hidden />
  );
};
