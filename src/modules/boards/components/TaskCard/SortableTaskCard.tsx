import { useSortable } from "@dnd-kit/sortable";

import type { TaskCard as TaskCardType } from "@/types/card";
import type { CardDragData } from "@/modules/boards/hooks/useBoardDnd";
import { TaskCard } from "@/modules/boards/components/TaskCard/TaskCard";

import styles from "./SortableTaskCard.module.scss";

interface SortableTaskCardProps {
  card: TaskCardType;
  columnId: string;
  onOpenDetails: (cardId: string) => void;
}

export const SortableTaskCard = ({
  card,
  columnId,
  onOpenDetails,
}: SortableTaskCardProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: card.id,
    data: {
      type: "card",
      columnId,
    } satisfies CardDragData,
    // Keep DOM order fixed during drag: ghost holds its slot, siblings
    // do not slide into it. Drop position is shown by CardDropPlaceholder.
    animateLayoutChanges: () => false,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.sortableCard} ${isDragging ? styles.dragging : ""}`}
      {...attributes}
      {...listeners}
    >
      <TaskCard card={card} onOpenDetails={onOpenDetails} />
    </div>
  );
};
