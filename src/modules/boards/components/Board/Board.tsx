import type { Board as BoardType } from "@/types/board";
import { BoardColumn } from "@/modules/boards/components/BoardColumn/BoardColumn";
import { BoardModals } from "@/modules/boards/components/Board/BoardModals/BoardModals";
import type {
  CardActions,
  ColumnActions,
} from "@/modules/boards/components/Board/board.types";
import { useBoardModals } from "@/modules/boards/hooks/modals/useBoardModals";

import styles from "./Board.module.scss";

interface BoardProps {
  board: BoardType;
  cardActions: CardActions;
  columnActions: ColumnActions;
}

export const Board = ({ board, cardActions, columnActions }: BoardProps) => {
  const modals = useBoardModals();

  const columnUiActions = {
    onOpenCreateCard: modals.openCreateCardModal,
    onOpenCardDetails: modals.openTaskDetailsModal,
    onOpenRenameColumn: modals.openRenameColumnModal,
    onOpenDeleteColumn: modals.openDeleteColumnModal,
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>{board.title}</h2>
          <p>{board.description}</p>
        </div>

        <div className={styles.boardContainer} data-board-scroll>
          <div className={styles.board}>
            {board.columns.map((column) => (
              <BoardColumn
                key={column.id}
                column={column}
                actions={columnUiActions}
              />
            ))}

            <button
              className={styles.addColumn}
              onClick={modals.openCreateColumnModal}
            >
              + Добавить колонку
            </button>
          </div>
        </div>
      </div>

      <BoardModals
        board={board}
        cardActions={cardActions}
        columnActions={columnActions}
        modals={modals}
      />
    </>
  );
};
