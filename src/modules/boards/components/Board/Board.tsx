import type { Board as BoardType } from "@/types/board";
import type {
  CreateCardFormValues,
  EditCardFormValues,
} from "@/modules/boards/types/cardForm.types";
import type {
  CreateColumnFormValues,
  RenameColumnFormValues,
} from "@/modules/boards/types/columnForm.types";
import { BoardColumn } from "@/modules/boards/components/BoardColumn/BoardColumn";
import { CreateCardModal } from "@/modules/boards/components/Modals/CreateCardModal/CreateCardModal";
import { CreateColumnModal } from "@/modules/boards/components/Modals/CreateColumnModal/CreateColumnModal";
import { RenameColumnModal } from "@/modules/boards/components/Modals/RenameColumnModal/RenameColumnModal";
import { DeleteColumnModal } from "@/modules/boards/components/Modals/DeleteColumnModal/DeleteColumnModal";
import { DeleteTaskModal } from "@/modules/boards/components/Modals/DeleteTaskModal/DeleteTaskModal";
import { TaskDetailsModal } from "@/modules/boards/components/Modals/TaskDetailsModal/TaskDetailsModal";
import { useBoardModals } from "@/modules/boards/hooks/useBoardModals";

import styles from "./Board.module.scss";

interface BoardProps {
  board: BoardType;
  onAddCard: (columnId: string, data: CreateCardFormValues) => void;
  onUpdateCard: (cardId: string, data: EditCardFormValues) => void;
  onDeleteCard: (cardId: string) => void;
  onAddColumn: (data: CreateColumnFormValues) => void;
  onRenameColumn: (columnId: string, data: RenameColumnFormValues) => void;
  onDeleteColumn: (columnId: string) => void;
}

export const Board = ({
  board,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onAddColumn,
  onRenameColumn,
  onDeleteColumn,
}: BoardProps) => {
  const {
    isCreateCardOpen,
    selectedColumnId,
    openCreateCardModal,
    closeCreateCardModal,
    selectedCardId,
    openTaskDetailsModal,
    closeTaskDetailsModal,
    isDeleteCardOpen,
    openDeleteCardModal,
    closeDeleteCardModal,
    isCreateColumnOpen,
    openCreateColumnModal,
    closeCreateColumnModal,
    isRenameColumnOpen,
    openRenameColumnModal,
    closeRenameColumnModal,
    isDeleteColumnOpen,
    openDeleteColumnModal,
    closeDeleteColumnModal,
  } = useBoardModals();

  const selectedCard =
    board.columns
      .flatMap((column) => column.cards)
      .find((card) => card.id === selectedCardId) ?? null;

  const selectedColumn =
    board.columns.find((column) => column.id === selectedColumnId) ?? null;

  const handleConfirmDeleteCard = () => {
    if (!selectedCardId) return;

    onDeleteCard(selectedCardId);
    closeDeleteCardModal();
    closeTaskDetailsModal();
  };

  const handleConfirmDeleteColumn = () => {
    if (!selectedColumnId) return;

    onDeleteColumn(selectedColumnId);
    closeDeleteColumnModal();
  };

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
              onOpenCardDetails={openTaskDetailsModal}
              onOpenRenameColumn={openRenameColumnModal}
              onOpenDeleteColumn={openDeleteColumnModal}
            />
          ))}

          <button
            className={styles.addColumn}
            onClick={openCreateColumnModal}
          >
            + Добавить колонку
          </button>
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

      <CreateColumnModal
        open={isCreateColumnOpen}
        onClose={closeCreateColumnModal}
        onCreate={(data) => {
          onAddColumn(data);
          closeCreateColumnModal();
        }}
      />

      <RenameColumnModal
        open={isRenameColumnOpen}
        initialTitle={selectedColumn?.title ?? ""}
        onClose={closeRenameColumnModal}
        onRename={(data) => {
          if (!selectedColumnId) return;

          onRenameColumn(selectedColumnId, data);
          closeRenameColumnModal();
        }}
      />

      <DeleteColumnModal
        open={isDeleteColumnOpen}
        columnTitle={selectedColumn?.title ?? ""}
        cardsCount={selectedColumn?.cards.length ?? 0}
        onClose={closeDeleteColumnModal}
        onConfirm={handleConfirmDeleteColumn}
      />

      <TaskDetailsModal
        open={selectedCard !== null}
        card={selectedCard}
        columns={board.columns}
        onClose={closeTaskDetailsModal}
        onUpdate={onUpdateCard}
        onDelete={openDeleteCardModal}
      />

      <DeleteTaskModal
        open={isDeleteCardOpen}
        cardTitle={selectedCard?.title ?? ""}
        onClose={closeDeleteCardModal}
        onConfirm={handleConfirmDeleteCard}
      />
    </div>
  );
};
