import type { Board as BoardType } from "@/types/board";
import { CreateCardModal } from "@/modules/boards/components/Modals/card/CreateCardModal/CreateCardModal";
import { CreateColumnModal } from "@/modules/boards/components/Modals/column/CreateColumnModal/CreateColumnModal";
import { RenameColumnModal } from "@/modules/boards/components/Modals/column/RenameColumnModal/RenameColumnModal";
import { DeleteColumnModal } from "@/modules/boards/components/Modals/column/DeleteColumnModal/DeleteColumnModal";
import { DeleteTaskModal } from "@/modules/boards/components/Modals/card/DeleteTaskModal/DeleteTaskModal";
import { TaskDetailsModal } from "@/modules/boards/components/Modals/card/TaskDetailsModal/TaskDetailsModal";
import type { useBoardModals } from "@/modules/boards/hooks/modals/useBoardModals";
import type {
  CardActions,
  ColumnActions,
} from "@/modules/boards/components/Board/board.types";

type BoardModalsState = ReturnType<typeof useBoardModals>;

interface BoardModalsProps {
  board: BoardType;
  cardActions: CardActions;
  columnActions: ColumnActions;
  modals: BoardModalsState;
}

export const BoardModals = ({
  board,
  cardActions,
  columnActions,
  modals,
}: BoardModalsProps) => {
  const {
    isCreateCardOpen,
    selectedColumnId,
    closeCreateCardModal,
    selectedCardId,
    closeTaskDetailsModal,
    isDeleteCardOpen,
    openDeleteCardModal,
    closeDeleteCardModal,
    isCreateColumnOpen,
    closeCreateColumnModal,
    isRenameColumnOpen,
    closeRenameColumnModal,
    isDeleteColumnOpen,
    closeDeleteColumnModal,
  } = modals;

  const selectedCard =
    board.columns
      .flatMap((column) => column.cards)
      .find((card) => card.id === selectedCardId) ?? null;

  const selectedColumn =
    board.columns.find((column) => column.id === selectedColumnId) ?? null;

  const handleConfirmDeleteCard = () => {
    if (!selectedCardId) return;

    cardActions.onDelete(selectedCardId);
    closeDeleteCardModal();
    closeTaskDetailsModal();
  };

  const handleConfirmDeleteColumn = () => {
    if (!selectedColumnId) return;

    columnActions.onDelete(selectedColumnId);
    closeDeleteColumnModal();
  };

  return (
    <>
      <CreateCardModal
        open={isCreateCardOpen}
        onClose={closeCreateCardModal}
        onCreate={(data) => {
          if (!selectedColumnId) return;

          cardActions.onAdd(selectedColumnId, data);
          closeCreateCardModal();
        }}
      />

      <CreateColumnModal
        open={isCreateColumnOpen}
        onClose={closeCreateColumnModal}
        onCreate={(data) => {
          columnActions.onAdd(data);
          closeCreateColumnModal();
        }}
      />

      <RenameColumnModal
        open={isRenameColumnOpen}
        initialTitle={selectedColumn?.title ?? ""}
        onClose={closeRenameColumnModal}
        onRename={(data) => {
          if (!selectedColumnId) return;

          columnActions.onRename(selectedColumnId, data);
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
        onUpdate={cardActions.onUpdate}
        onDelete={openDeleteCardModal}
      />

      <DeleteTaskModal
        open={isDeleteCardOpen}
        cardTitle={selectedCard?.title ?? ""}
        onClose={closeDeleteCardModal}
        onConfirm={handleConfirmDeleteCard}
      />
    </>
  );
};
