import type { TaskCard as TaskCardType } from "@/types/card";
import { PriorityTag } from "@/modules/boards/components/TaskCard/PriorityTag/PriorityTag";

import styles from "./TaskCard.module.scss"

interface TaskCardProps {
  card: TaskCardType;
}

export const TaskCard = ({ card }: TaskCardProps) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{card.title}</h3>

      <p className={styles.description}>{card.description}</p>

      <PriorityTag priority={card.priority}/>
    </div>
  );
};