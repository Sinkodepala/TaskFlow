import type { TaskCard as TaskCardType } from "@/types/card";
import { PriorityTag } from "@/modules/boards/components/TaskCard/PriorityTag/PriorityTag";
import { DueDateBadge } from "@/modules/boards/components/shared/DueDateBadge/DueDateBadge";

import styles from "./TaskCard.module.scss";

interface TaskCardProps {
  card: TaskCardType;
  onOpenDetails?: (cardId: string) => void;
}

export const TaskCard = ({ card, onOpenDetails }: TaskCardProps) => {
  return (
    <div
      className={styles.card}
      onClick={onOpenDetails ? () => onOpenDetails(card.id) : undefined}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{card.title}</h3>
      </div>

      <div className={styles.footer}>
        {card.dueDate ? <DueDateBadge dueDate={card.dueDate} /> : <span />}
        <PriorityTag priority={card.priority} />
      </div>
    </div>
  );
};
