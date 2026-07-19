import type { KeyboardEvent } from "react";

import type { TaskCard as TaskCardType } from "@/types/card";
import { PriorityTag } from "@/modules/boards/components/TaskCard/PriorityTag/PriorityTag";

import styles from "./TaskCard.module.scss";

interface TaskCardProps {
  card: TaskCardType;
  onOpenDetails: (cardId: string) => void;
}

export const TaskCard = ({ card, onOpenDetails }: TaskCardProps) => {
  const handleOpenDetails = () => {
    onOpenDetails(card.id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenDetails();
    }
  };

  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={handleOpenDetails}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{card.title}</h3>
      </div>

      <div className={styles.footer}>
        <PriorityTag priority={card.priority} />
      </div>
    </div>
  );
};
