import type { RefObject } from "react";

import type { TaskCard } from "@/types/card";
import { PriorityTag } from "@/modules/boards/components/TaskCard/PriorityTag/PriorityTag";
import { DueDateBadge } from "@/modules/boards/components/shared/DueDateBadge/DueDateBadge";
import { formatDate } from "@/modules/boards/utils/formatDate";

import styles from "../TaskDetailsModal.module.scss";

interface TaskDetailsViewProps {
  card: TaskCard;
  columnTitle: string;
  contentRef: RefObject<HTMLDivElement | null>;
}

export const TaskDetailsView = ({
  card,
  columnTitle,
  contentRef,
}: TaskDetailsViewProps) => {
  return (
    <div ref={contentRef} className={styles.content} tabIndex={-1}>
      <div className={styles.field}>
        <span className={styles.label}>Описание</span>
        <p className={styles.value}>{card.description || "Нет описания"}</p>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <span className={styles.label}>Приоритет</span>
          <PriorityTag priority={card.priority} />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Статус</span>
          <p className={styles.value}>{columnTitle}</p>
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Дедлайн</span>
        {card.dueDate ? (
          <DueDateBadge dueDate={card.dueDate} />
        ) : (
          <p className={styles.value}>—</p>
        )}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <span className={styles.label}>Создано</span>
          <p className={styles.value}>{formatDate(card.createdAt)}</p>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Обновлено</span>
          <p className={styles.value}>{formatDate(card.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
};
