import { useState } from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { UniqueIdentifier } from "@dnd-kit/core";

import type { BoardColumn as BoardColumnType } from "@/types/column";
import type {
  CardInsertPosition,
  ColumnDragData,
  DropPreview,
} from "@/modules/boards/hooks/useBoardDnd";
import { DROP_PLACEHOLDER_ID } from "@/modules/boards/hooks/useBoardDnd";
import { SortableTaskCard } from "@/modules/boards/components/TaskCard/SortableTaskCard";
import { CardDropPlaceholder } from "@/modules/boards/components/TaskCard/CardDropPlaceholder";
import { ColumnHeader } from "@/modules/boards/components/BoardColumn/ColumnHeader/ColumnHeader";
import { CollapsedColumnHeader } from "@/modules/boards/components/BoardColumn/CollapsedColumnHeader/CollapsedColumnHeader";

import styles from "./BoardColumn.module.scss";

interface BoardColumnProps {
  column: BoardColumnType;
  onOpenCreateCardModal: (columnId: string) => void;
  onOpenCardDetails: (cardId: string) => void;
  onOpenRenameColumn: (columnId: string) => void;
  onOpenDeleteColumn: (columnId: string) => void;
  activeCardId?: UniqueIdentifier | null;
  overCardId?: UniqueIdentifier | null;
  overColumnId?: string | null;
  insertPosition?: CardInsertPosition | null;
  isColumnChromeDrop?: boolean;
  dropPreview?: DropPreview | null;
}

export const BoardColumn = ({
  column,
  onOpenCreateCardModal,
  onOpenCardDetails,
  onOpenRenameColumn,
  onOpenDeleteColumn,
  activeCardId = null,
  overCardId = null,
  overColumnId = null,
  insertPosition = null,
  isColumnChromeDrop = false,
  dropPreview = null,
}: BoardColumnProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      isCollapsed,
    } satisfies ColumnDragData,
    animateLayoutChanges: () => false,
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const style = {
    // Column order during drag comes from columnDragOrder re-render, not transforms.
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
  };

  const previewOrder =
    dropPreview?.columnId === column.id ? dropPreview.order : null;
  const isPreviewMode = previewOrder !== null;

  const cardIds = previewOrder
    ? previewOrder.filter((id) => id !== DROP_PLACEHOLDER_ID)
    : column.cards.map((card) => card.id);

  const cardsById = new Map(column.cards.map((card) => [card.id, card]));

  const showDropPlaceholder =
    !isPreviewMode &&
    Boolean(activeCardId) &&
    overColumnId === column.id &&
    overCardId !== activeCardId;

  const showPlaceholderAtEnd =
    !isPreviewMode &&
    Boolean(activeCardId) &&
    overColumnId === column.id &&
    overCardId === null &&
    isColumnChromeDrop;

  const isDropTarget = Boolean(activeCardId) && overColumnId === column.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-column-id={column.id}
      className={`${styles.column} ${isCollapsed ? styles.collapsed : ""} ${isDragging ? styles.dragging : ""} ${isDropTarget ? styles.dropTarget : ""}`}
      onClick={isCollapsed ? toggleCollapse : undefined}
      {...(isCollapsed ? { ...attributes, ...listeners } : {})}
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
            onRename={() => onOpenRenameColumn(column.id)}
            onDelete={() => onOpenDeleteColumn(column.id)}
            dragHandleProps={{ ...attributes, ...listeners }}
          />

          <div className={styles.cardsWrapper}>
            <SortableContext
              id={column.id}
              items={cardIds}
              strategy={verticalListSortingStrategy}
            >
              <div className={styles.cards} data-column-cards-id={column.id}>
                {previewOrder
                  ? previewOrder.map((itemId) => {
                      if (itemId === DROP_PLACEHOLDER_ID) {
                        return (
                          <CardDropPlaceholder
                            key={DROP_PLACEHOLDER_ID}
                            columnId={column.id}
                            anchorCardId={null}
                            insertPosition={null}
                          />
                        );
                      }

                      const card = cardsById.get(String(itemId));

                      if (!card) {
                        return null;
                      }

                      return (
                        <div key={card.id} className={styles.cardSlot}>
                          <SortableTaskCard
                            card={card}
                            columnId={column.id}
                            onOpenDetails={onOpenCardDetails}
                          />
                        </div>
                      );
                    })
                  : column.cards.map((card) => {
                      const isOverTarget =
                        showDropPlaceholder &&
                        overCardId === card.id &&
                        card.id !== activeCardId;

                      return (
                        <div key={card.id} className={styles.cardSlot}>
                          {isOverTarget && insertPosition === "before" ? (
                            <CardDropPlaceholder
                              columnId={column.id}
                              anchorCardId={overCardId}
                              insertPosition={insertPosition}
                            />
                          ) : null}
                          <SortableTaskCard
                            card={card}
                            columnId={column.id}
                            onOpenDetails={onOpenCardDetails}
                          />
                          {isOverTarget && insertPosition === "after" ? (
                            <CardDropPlaceholder
                              columnId={column.id}
                              anchorCardId={overCardId}
                              insertPosition={insertPosition}
                            />
                          ) : null}
                        </div>
                      );
                    })}
                {showPlaceholderAtEnd ? (
                  <CardDropPlaceholder
                    columnId={column.id}
                    anchorCardId={null}
                    insertPosition={null}
                  />
                ) : null}
              </div>
            </SortableContext>

            <div className={styles.footer}>
              <button
                className={styles.addCard}
                type="button"
                onClick={() => onOpenCreateCardModal(column.id)}
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
