import type { TaskCard as TaskCardType } from "@/types/card";
import { PriorityTag } from "@/modules/boards/components/TaskCard/PriorityTag/PriorityTag";

import styles from "./TaskCard.module.scss";

interface TaskCardProps {
  card: TaskCardType;
}

export const TaskCard = ({ card }: TaskCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{card.title}</h3>
      </div>

      <div className={styles.footer}>
        <PriorityTag priority={card.priority} />
      </div>
    </div>
  );
};
