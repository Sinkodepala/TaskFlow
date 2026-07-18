import type { Board as BoardType } from "@/types/board";
import type { CreateCardFormValues } from "@/modules/boards/types/cardForm.types";
import { BoardColumn } from "@/modules/boards/components/BoardColumn/BoardColumn";
import { CreateCardModal } from "@/modules/boards/components/Modals/CreateCardModal/CreateCardModal";
import { useBoardModals } from "@/modules/boards/hooks/useBoardModals";

import styles from "./Board.module.scss";

interface BoardProps {
  board: BoardType;
  onAddCard: (columnId: string, data: CreateCardFormValues) => void;
}

export const Board = ({ board, onAddCard }: BoardProps) => {
  const {
    isCreateCardOpen,
    selectedColumnId,
    openCreateCardModal,
    closeCreateCardModal,
  } = useBoardModals();
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2>{board.title}</h2>
        <p>{board.description}</p>
      </div>

      <div className={styles.boardContainer}>
        <div className={styles.board}>
          {board.columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              onOpenCreateCardModal={openCreateCardModal}
            />
          ))}

          <button className={styles.addColumn}>+ Add Column</button>
        </div>
      </div>

      <CreateCardModal
        open={isCreateCardOpen}
        onClose={closeCreateCardModal}
        onCreate={(data) => {
          if (!selectedColumnId) return;

          onAddCard(selectedColumnId, data);

          closeCreateCardModal();
        }}
      />
    </div>
  );
};
