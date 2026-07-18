import { useState } from "react";

import type { BoardColumn as BoardColumnType } from "@/types/column";
import type { CreateCardFormValues } from "@/modules/boards/types/cardForm.types";
import { TaskCard } from "@/modules/boards/components/TaskCard";

import styles from "./BoardColumn.module.scss";
import { CreateCardModal } from "@/modules/boards/components//CreateCardModal/CreateCardModal";

interface BoardColumnProps {
  column: BoardColumnType;
  onAddCard: (columnId: string, data: CreateCardFormValues) => void;
}

export const BoardColumn = ({ column, onAddCard }: BoardColumnProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className={styles.column}>
      <h2>{column.title}</h2>

      {column.cards.map((card) => (
        <TaskCard key={card.id} card={card} />
      ))}

      <button onClick={() => setIsModalOpen(true)}>Add Card</button>

      <CreateCardModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(data) => {
          onAddCard(column.id, data);
        }}
      />
    </div>
  );
};
