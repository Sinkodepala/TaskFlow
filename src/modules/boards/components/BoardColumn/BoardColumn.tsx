import { useState } from "react";

import type { BoardColumn as BoardColumnType } from "@/types/column";

import { TaskCard } from "@/modules/boards/components/TaskCard";
import { ColumnHeader } from "@/modules/boards/components/BoardColumn/ColumnHeader/ColumnHeader";
import { CollapsedColumnHeader } from "@/modules/boards/components/BoardColumn/CollapsedColumnHeader/CollapsedColumnHeader";

import styles from "./BoardColumn.module.scss";

interface BoardColumnProps {
  column: BoardColumnType;
  onOpenCreateCardModal: (columnId: string) => void;
  onOpenCardDetails: (cardId: string) => void;
}

export const BoardColumn = ({
  column,
  onOpenCreateCardModal,
  onOpenCardDetails,
}: BoardColumnProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      className={`${styles.column} ${isCollapsed ? styles.collapsed : ""}`}
      onClick={isCollapsed ? toggleCollapse : undefined}
    >
      {isCollapsed ? (
        <CollapsedColumnHeader
          title={column.title}
          count={column.cards.length}
        />
      ) : (
        <>
          <ColumnHeader
            title={column.title}
            count={column.cards.length}
            onCollapse={toggleCollapse}
          />

          <div className={styles.cardsWrapper}>
            <div className={styles.cards}>
              {column.cards.map((card) => (
                <TaskCard
                  key={card.id}
                  card={card}
                  onOpenDetails={onOpenCardDetails}
                />
              ))}
            </div>

            <div className={styles.footer}>
              <button
                className={styles.addCard}
                type="button"
                onClick={() => onOpenCreateCardModal(column.id)}
              >
                + Add Card
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
