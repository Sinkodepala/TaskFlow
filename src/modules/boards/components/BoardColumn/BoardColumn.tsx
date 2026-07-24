import { useState } from "react";

import type { BoardColumn as BoardColumnType } from "@/types/column";
import { TaskCard } from "@/modules/boards/components/TaskCard/TaskCard";
import { ColumnHeader } from "@/modules/boards/components/BoardColumn/ColumnHeader/ColumnHeader";
import { CollapsedColumnHeader } from "@/modules/boards/components/BoardColumn/CollapsedColumnHeader/CollapsedColumnHeader";
import type { ColumnUiActions } from "@/modules/boards/components/Board/board.types";

import styles from "./BoardColumn.module.scss";

interface BoardColumnProps {
  column: BoardColumnType;
  actions: ColumnUiActions;
}

export const BoardColumn = ({ column, actions }: BoardColumnProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      data-column-id={column.id}
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
            onRename={() => actions.onOpenRenameColumn(column.id)}
            onDelete={() => actions.onOpenDeleteColumn(column.id)}
          />

          <div className={styles.cardsWrapper}>
            <div className={styles.cards} data-column-cards-id={column.id}>
              {column.cards.map((card) => (
                <TaskCard
                  key={card.id}
                  card={card}
                  onOpenDetails={actions.onOpenCardDetails}
                />
              ))}
            </div>

            <div className={styles.footer}>
              <button
                className={styles.addCard}
                type="button"
                onClick={() => actions.onOpenCreateCard(column.id)}
              >
                + Добавить карточку
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
