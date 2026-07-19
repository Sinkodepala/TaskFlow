import type { TaskCard as TaskCardType } from "@/types/card";
import { PriorityTag } from "@/modules/boards/components/TaskCard/PriorityTag/PriorityTag";
import { getDueDateStatus } from "@/modules/boards/utils/getDueDateStatus";

import styles from "./TaskCard.module.scss";

interface TaskCardProps {
  card: TaskCardType;
  onOpenDetails: (cardId: string) => void;
}

const formatDueDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const dueDateStatusClass: Record<string, string | undefined> = {
  overdue: styles.dateOverdue,
  soon: styles.dateSoon,
  normal: undefined,
};

export const TaskCard = ({ card, onOpenDetails }: TaskCardProps) => {
  const dueStatus = card.dueDate ? getDueDateStatus(card.dueDate) : null;

  return (
    <div className={styles.card} onClick={() => onOpenDetails(card.id)}>
      <div className={styles.header}>
        <h3 className={styles.title}>{card.title}</h3>
      </div>

      <div className={styles.footer}>
        {card.dueDate && dueStatus ? (
          <span
            className={`${styles.date} ${dueDateStatusClass[dueStatus] ?? ""}`}
          >
            {formatDueDate(card.dueDate)}
          </span>
        ) : (
          <span />
        )}
        <PriorityTag priority={card.priority} />
      </div>
    </div>
  );
};
