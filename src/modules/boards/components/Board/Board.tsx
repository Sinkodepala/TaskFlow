import {
  DndContext,
  DragOverlay,
  type DropAnimation,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

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
import { BoardColumnOverlay } from "@/modules/boards/components/Board/BoardColumnOverlay";
import { TaskCard } from "@/modules/boards/components/TaskCard/TaskCard";
import { CreateCardModal } from "@/modules/boards/components/Modals/CreateCardModal/CreateCardModal";
import { CreateColumnModal } from "@/modules/boards/components/Modals/CreateColumnModal/CreateColumnModal";
import { RenameColumnModal } from "@/modules/boards/components/Modals/RenameColumnModal/RenameColumnModal";
import { DeleteColumnModal } from "@/modules/boards/components/Modals/DeleteColumnModal/DeleteColumnModal";
import { DeleteTaskModal } from "@/modules/boards/components/Modals/DeleteTaskModal/DeleteTaskModal";
import { TaskDetailsModal } from "@/modules/boards/components/Modals/TaskDetailsModal/TaskDetailsModal";
import { useBoardModals } from "@/modules/boards/hooks/useBoardModals";
import { useBoardDnd } from "@/modules/boards/hooks/useBoardDnd";

import styles from "./Board.module.scss";

interface BoardProps {
  board: BoardType;
  onAddCard: (columnId: string, data: CreateCardFormValues) => void;
  onUpdateCard: (cardId: string, data: EditCardFormValues) => void;
  onDeleteCard: (cardId: string) => void;
  onAddColumn: (data: CreateColumnFormValues) => void;
  onRenameColumn: (columnId: string, data: RenameColumnFormValues) => void;
  onDeleteColumn: (columnId: string) => void;
  onMoveCard: (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    targetIndex: number,
  ) => void;
  onMoveColumn: (columnId: string, targetIndex: number) => void;
}

const dropAnimation: DropAnimation = {
  duration: 250,
  easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

export const Board = ({
  board,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onAddColumn,
  onRenameColumn,
  onDeleteColumn,
  onMoveCard,
  onMoveColumn,
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

  const {
    sensors,
    measuring,
    collisionDetection,
    activeId,
    activeType,
    activeCard,
    activeColumn,
    activeColumnCollapsed,
    overCardId,
    overColumnId,
    insertPosition,
    isColumnChromeDrop,
    dropPreview,
    columnDragOrder,
    onDragStart,
    onDragOver,
    onDragMove,
    onDragEnd,
    onDragCancel,
  } = useBoardDnd({
    board,
    onMoveCard,
    onMoveColumn,
  });

  const selectedCard =
    board.columns
      .flatMap((column) => column.cards)
      .find((card) => card.id === selectedCardId) ?? null;

  const selectedColumn =
    board.columns.find((column) => column.id === selectedColumnId) ?? null;

  const columnsById = new Map(
    board.columns.map((column) => [column.id, column]),
  );
  const columnIds = columnDragOrder ?? board.columns.map((column) => column.id);
  const orderedColumns = columnIds
    .map((id) => columnsById.get(String(id)))
    .filter((column): column is NonNullable<typeof column> => Boolean(column));

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

      <div className={styles.boardContainer} data-board-scroll>
        <DndContext
          sensors={sensors}
          measuring={measuring}
          collisionDetection={collisionDetection}
          autoScroll={false}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
          <div className={styles.board}>
            <SortableContext
              items={columnIds}
              strategy={horizontalListSortingStrategy}
            >
              {orderedColumns.map((column) => (
                <BoardColumn
                  key={column.id}
                  column={column}
                  onOpenCreateCardModal={openCreateCardModal}
                  onOpenCardDetails={openTaskDetailsModal}
                  onOpenRenameColumn={openRenameColumnModal}
                  onOpenDeleteColumn={openDeleteColumnModal}
                  activeCardId={activeType === "card" ? activeId : null}
                  overCardId={overCardId}
                  overColumnId={overColumnId}
                  insertPosition={insertPosition}
                  isColumnChromeDrop={isColumnChromeDrop}
                  dropPreview={dropPreview}
                />
              ))}
            </SortableContext>

            <button
              className={styles.addColumn}
              onClick={openCreateColumnModal}
            >
              + Добавить колонку
            </button>
          </div>

          <DragOverlay dropAnimation={dropAnimation}>
            {activeType === "card" && activeCard ? (
              <TaskCard card={activeCard} variant="overlay" />
            ) : null}
            {activeType === "column" && activeColumn ? (
              <BoardColumnOverlay
                title={activeColumn.title}
                count={activeColumn.cards.length}
                isCollapsed={activeColumnCollapsed}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
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
