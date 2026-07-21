import { useCallback, useMemo, useRef, useState } from "react";
import {
  closestCorners,
  MeasuringStrategy,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type ClientRect,
  type CollisionDetection,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";

type PointerCoordinates = { x: number; y: number };

import type { Board } from "@/types/board";
import type { TaskCard } from "@/types/card";
import type { BoardColumn } from "@/types/column";

export type DndItemType = "card" | "column";
export type CardInsertPosition = "before" | "after";
export type DropTargetType = DndItemType | "placeholder";

export const DROP_PLACEHOLDER_ID = "__drop-placeholder__";

export interface DropPreview {
  columnId: string;
  order: UniqueIdentifier[];
}

export interface CardDragData {
  type: "card";
  columnId: string;
}

export interface ColumnDragData {
  type: "column";
  isCollapsed?: boolean;
}

export interface PlaceholderDragData {
  type: "placeholder";
  columnId: string;
  anchorCardId: UniqueIdentifier | null;
  insertPosition: CardInsertPosition | null;
}

type DragData = CardDragData | ColumnDragData;

interface SortableOverData {
  type?: DropTargetType;
  columnId?: string;
  anchorCardId?: UniqueIdentifier | null;
  insertPosition?: CardInsertPosition | null;
  sortable?: {
    containerId?: UniqueIdentifier;
    index?: number;
  };
}

interface UseBoardDndParams {
  board: Board;
  onMoveCard: (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    targetIndex: number,
  ) => void;
  onMoveColumn: (columnId: string, targetIndex: number) => void;
}

const EDGE_ZONE_RATIO = 0.3;
const COLUMN_AUTO_SCROLL_EDGE_PX = 48;
const COLUMN_AUTO_SCROLL_MAX_SPEED = 3;
const COLUMN_REORDER_MIDPOINT_RATIO = 0.5;

const isCardData = (data: DragData | undefined): data is CardDragData =>
  data?.type === "card";

const isColumnData = (data: DragData | undefined): data is ColumnDragData =>
  data?.type === "column";

const hasPassedColumnMidpoint = (
  fromIndex: number,
  toIndex: number,
  overRect: { left: number; width: number },
  pointerX: number,
): boolean => {
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return false;
  }

  const midpoint =
    overRect.left + overRect.width * COLUMN_REORDER_MIDPOINT_RATIO;

  // Moving right: commit after entering the right half of the target.
  if (fromIndex < toIndex) {
    return pointerX >= midpoint;
  }

  // Moving left: commit after entering the left half of the target.
  return pointerX <= midpoint;
};

const arrayMove = <T,>(items: T[], fromIndex: number, toIndex: number): T[] => {
  if (fromIndex === toIndex) {
    return items;
  }

  const next = [...items];
  const [item] = next.splice(fromIndex, 1);

  if (item === undefined) {
    return items;
  }

  next.splice(toIndex, 0, item);

  return next;
};

const findColumnIdForCard = (
  board: Board,
  cardId: UniqueIdentifier,
): string | null => {
  const column = board.columns.find((col) =>
    col.cards.some((card) => card.id === cardId),
  );

  return column?.id ?? null;
};

const getInsertPosition = (
  overRect: ClientRect,
  pointerY: number | null,
  middleFallback: CardInsertPosition = "before",
): CardInsertPosition => {
  if (pointerY === null || overRect.height <= 0) {
    return middleFallback;
  }

  const ratio = (pointerY - overRect.top) / overRect.height;

  // Top 30% → before (blue above), bottom 30% → after (blue below);
  // middle keeps previous side.
  if (ratio <= EDGE_ZONE_RATIO) {
    return "before";
  }

  if (ratio >= 1 - EDGE_ZONE_RATIO) {
    return "after";
  }

  return middleFallback;
};

const isPointerInsideColumnCards = (
  columnId: string,
  pointer: PointerCoordinates | null,
): boolean => {
  if (!pointer) return false;

  const cardsElement = document.querySelector(
    `[data-column-cards-id="${columnId}"]`,
  );

  if (!(cardsElement instanceof HTMLElement)) {
    return false;
  }

  const rect = cardsElement.getBoundingClientRect();

  return (
    pointer.x >= rect.left &&
    pointer.x <= rect.right &&
    pointer.y >= rect.top &&
    pointer.y <= rect.bottom
  );
};

const resolveInsertNearGhost = (
  sourceColumnId: string,
  sourceIndex: number,
  targetColumnId: string,
  overIndex: number,
  pointerPosition: CardInsertPosition,
): CardInsertPosition => {
  if (sourceColumnId !== targetColumnId || sourceIndex < 0 || overIndex < 0) {
    return pointerPosition;
  }

  if (overIndex === sourceIndex + 1) {
    return "after";
  }

  if (overIndex === sourceIndex - 1) {
    return "before";
  }

  return pointerPosition;
};

const findCardIndexInBoard = (
  columns: Board["columns"],
  columnId: string,
  cardId: UniqueIdentifier,
  sortableIndexFallback?: number,
): number => {
  const column = columns.find((item) => item.id === columnId);
  const index = column?.cards.findIndex((card) => card.id === cardId) ?? -1;

  if (index !== -1) {
    return index;
  }

  return sortableIndexFallback ?? -1;
};

const resolveCardTargetIndex = (
  overIndex: number,
  insertPosition: CardInsertPosition,
  sourceColumnId: string,
  targetColumnId: string,
  sourceIndex: number,
): number => {
  let targetIndex =
    insertPosition === "after" ? overIndex + 1 : overIndex;

  if (
    sourceColumnId === targetColumnId &&
    sourceIndex !== -1 &&
    sourceIndex < targetIndex
  ) {
    targetIndex -= 1;
  }

  return targetIndex;
};

const getColumnCardIds = (
  columns: Board["columns"],
  columnId: string,
): UniqueIdentifier[] => {
  const column = columns.find((item) => item.id === columnId);

  return column?.cards.map((card) => card.id) ?? [];
};

const insertPlaceholderAt = (
  cardIds: UniqueIdentifier[],
  index: number,
): UniqueIdentifier[] => {
  const order = [...cardIds];
  const clampedIndex = Math.max(0, Math.min(index, order.length));
  order.splice(clampedIndex, 0, DROP_PLACEHOLDER_ID);

  return order;
};

const swapPlaceholderWithCard = (
  order: UniqueIdentifier[],
  cardId: UniqueIdentifier,
): UniqueIdentifier[] => {
  const placeholderIndex = order.indexOf(DROP_PLACEHOLDER_ID);
  const cardIndex = order.indexOf(cardId);

  if (placeholderIndex === -1 || cardIndex === -1) {
    return order;
  }

  if (placeholderIndex === cardIndex) {
    return order;
  }

  const next = [...order];
  next[placeholderIndex] = cardId;
  next[cardIndex] = DROP_PLACEHOLDER_ID;

  return next;
};

const movePlaceholderToEnd = (
  cardIds: UniqueIdentifier[],
): UniqueIdentifier[] => [...cardIds, DROP_PLACEHOLDER_ID];

const movePlaceholderToStart = (
  cardIds: UniqueIdentifier[],
): UniqueIdentifier[] => [DROP_PLACEHOLDER_ID, ...cardIds];

const getColumnCardsScrollElement = (
  columnId: string,
): HTMLElement | null => {
  const element = document.querySelector(
    `[data-column-cards-id="${columnId}"]`,
  );

  return element instanceof HTMLElement ? element : null;
};

const getColumnRootElement = (columnId: string): HTMLElement | null => {
  const element = document.querySelector(`[data-column-id="${columnId}"]`);

  return element instanceof HTMLElement ? element : null;
};

const getColumnLiveRect = (
  columnId: UniqueIdentifier,
): { left: number; width: number } | null => {
  const element = getColumnRootElement(String(columnId));

  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();

  return { left: rect.left, width: rect.width };
};

const getColumnAutoScrollDelta = (
  columnId: string,
  pointer: PointerCoordinates,
): number => {
  const scrollElement = getColumnCardsScrollElement(columnId);
  const columnElement = getColumnRootElement(columnId);

  if (!scrollElement || !columnElement) {
    return 0;
  }

  const columnRect = columnElement.getBoundingClientRect();
  const cardsRect = scrollElement.getBoundingClientRect();

  const insideColumn =
    pointer.x >= columnRect.left &&
    pointer.x <= columnRect.right &&
    pointer.y >= columnRect.top &&
    pointer.y <= columnRect.bottom;

  if (!insideColumn) {
    return 0;
  }

  // Header / area above the cards list → scroll up.
  if (pointer.y < cardsRect.top) {
    return -COLUMN_AUTO_SCROLL_MAX_SPEED;
  }

  // Footer / area below the cards list → scroll down.
  if (pointer.y > cardsRect.bottom) {
    return COLUMN_AUTO_SCROLL_MAX_SPEED;
  }

  const topDistance = pointer.y - cardsRect.top;
  const bottomDistance = cardsRect.bottom - pointer.y;

  if (topDistance < COLUMN_AUTO_SCROLL_EDGE_PX) {
    return -COLUMN_AUTO_SCROLL_MAX_SPEED;
  }

  if (bottomDistance < COLUMN_AUTO_SCROLL_EDGE_PX) {
    return COLUMN_AUTO_SCROLL_MAX_SPEED;
  }

  return 0;
};

const getBoardScrollElement = (): HTMLElement | null => {
  const element = document.querySelector("[data-board-scroll]");

  return element instanceof HTMLElement ? element : null;
};

const getBoardAutoScrollDelta = (pointer: PointerCoordinates): number => {
  const scrollElement = getBoardScrollElement();

  if (!scrollElement) {
    return 0;
  }

  const rect = scrollElement.getBoundingClientRect();

  // Keep a loose vertical window so we don't scroll when far above/below the board.
  const verticallyNear =
    pointer.y >= rect.top - COLUMN_AUTO_SCROLL_EDGE_PX &&
    pointer.y <= rect.bottom + COLUMN_AUTO_SCROLL_EDGE_PX;

  if (!verticallyNear) {
    return 0;
  }

  // Allow pointer past the container edge (work-area / padding boundary).
  if (pointer.x < rect.left + COLUMN_AUTO_SCROLL_EDGE_PX) {
    return -COLUMN_AUTO_SCROLL_MAX_SPEED;
  }

  if (pointer.x > rect.right - COLUMN_AUTO_SCROLL_EDGE_PX) {
    return COLUMN_AUTO_SCROLL_MAX_SPEED;
  }

  return 0;
};

export const useBoardDnd = ({
  board,
  onMoveCard,
  onMoveColumn,
}: UseBoardDndParams) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeType, setActiveType] = useState<DndItemType | null>(null);
  const [activeColumnCollapsed, setActiveColumnCollapsed] = useState(false);
  const [overCardId, setOverCardId] = useState<UniqueIdentifier | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);
  const [insertPosition, setInsertPosition] =
    useState<CardInsertPosition | null>(null);
  const [isColumnChromeDrop, setIsColumnChromeDrop] = useState(false);
  const [dropPreview, setDropPreview] = useState<DropPreview | null>(null);
  const [columnDragOrder, setColumnDragOrder] = useState<
    UniqueIdentifier[] | null
  >(null);
  const pointerCoordinatesRef = useRef<PointerCoordinates | null>(null);
  const dropPreviewRef = useRef<DropPreview | null>(null);
  const autoScrollFrameRef = useRef<number | null>(null);
  const columnDragOrderRef = useRef<UniqueIdentifier[] | null>(null);
  const stickyDropRef = useRef<{
    columnId: string | null;
    overCardId: UniqueIdentifier | null;
    insertPosition: CardInsertPosition | null;
    isColumnChromeDrop: boolean;
  }>({
    columnId: null,
    overCardId: null,
    insertPosition: null,
    isColumnChromeDrop: false,
  });

  const clearStickyDrop = useCallback(() => {
    stickyDropRef.current = {
      columnId: null,
      overCardId: null,
      insertPosition: null,
      isColumnChromeDrop: false,
    };
  }, []);

  const clearDropPreview = useCallback(() => {
    dropPreviewRef.current = null;
    setDropPreview(null);
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollFrameRef.current !== null) {
      cancelAnimationFrame(autoScrollFrameRef.current);
      autoScrollFrameRef.current = null;
    }
  }, []);

  const startColumnCardsAutoScroll = useCallback(() => {
    stopAutoScroll();

    const tick = () => {
      const pointer = pointerCoordinatesRef.current;
      const columnId = stickyDropRef.current.columnId;

      if (pointer && columnId) {
        const scrollElement = getColumnCardsScrollElement(columnId);
        const delta = getColumnAutoScrollDelta(columnId, pointer);

        if (scrollElement && delta !== 0) {
          scrollElement.scrollBy({ top: delta });
        }
      }

      autoScrollFrameRef.current = requestAnimationFrame(tick);
    };

    autoScrollFrameRef.current = requestAnimationFrame(tick);
  }, [stopAutoScroll]);

  const startBoardAutoScroll = useCallback(() => {
    stopAutoScroll();

    const tick = () => {
      const pointer = pointerCoordinatesRef.current;
      const scrollElement = getBoardScrollElement();

      if (pointer && scrollElement) {
        const delta = getBoardAutoScrollDelta(pointer);

        if (delta !== 0) {
          scrollElement.scrollBy({ left: delta });
        }
      }

      autoScrollFrameRef.current = requestAnimationFrame(tick);
    };

    autoScrollFrameRef.current = requestAnimationFrame(tick);
  }, [stopAutoScroll]);

  const updateDropPreview = useCallback((next: DropPreview | null) => {
    dropPreviewRef.current = next;
    setDropPreview(next);
  }, []);

  const setStickyDrop = useCallback(
    (next: {
      columnId: string;
      overCardId: UniqueIdentifier | null;
      insertPosition: CardInsertPosition | null;
      isColumnChromeDrop: boolean;
    }) => {
      stickyDropRef.current = next;
      setOverCardId(next.overCardId);
      setOverColumnId(next.columnId);
      setInsertPosition(next.insertPosition);
      setIsColumnChromeDrop(next.isColumnChromeDrop);
    },
    [],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const measuring = useMemo(
    () => ({
      droppable: {
        strategy: MeasuringStrategy.Always,
      },
    }),
    [],
  );

  const collisionDetection: CollisionDetection = useCallback(
    (args) => {
      const { active, pointerCoordinates } = args;

      if (pointerCoordinates) {
        pointerCoordinatesRef.current = pointerCoordinates;
      }

      const activeData = active.data.current as DragData | undefined;

      // Column drag: keep a live visual order (ghost slot included). Swap only
      // after crossing 50% of a column, using indices from that visual order.
      if (isColumnData(activeData)) {
        const pointerCollisions = pointerWithin(args);
        const baseCollisions =
          pointerCollisions.length > 0 ? pointerCollisions : closestCorners(args);

        const getCollisionData = (
          collision: (typeof baseCollisions)[number],
        ) =>
          collision.data?.droppableContainer?.data?.current as
            | SortableOverData
            | undefined;

        let targetColumnId: UniqueIdentifier | null = null;

        const columnCollision = baseCollisions.find(
          (collision) => getCollisionData(collision)?.type === "column",
        );

        if (columnCollision) {
          targetColumnId = columnCollision.id;
        } else {
          const cardCollision = baseCollisions.find(
            (collision) => getCollisionData(collision)?.type === "card",
          );
          const cardColumnId = cardCollision
            ? getCollisionData(cardCollision)?.columnId
            : undefined;

          if (cardColumnId) {
            targetColumnId = cardColumnId;
          }
        }

        const order = columnDragOrderRef.current;
        const pointerX = pointerCoordinates?.x ?? null;

        if (
          order &&
          pointerX !== null &&
          targetColumnId &&
          targetColumnId !== active.id
        ) {
          const fromIndex = order.indexOf(active.id);
          const toIndex = order.indexOf(targetColumnId);

          if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
            // Step one neighbor at a time so midpoints always match the
            // current visual layout (works for 1↔2 and 1↔4 alike).
            const stepIndex = toIndex > fromIndex ? fromIndex + 1 : fromIndex - 1;
            const neighborId = order[stepIndex];

            if (neighborId !== undefined) {
              const neighborRect = getColumnLiveRect(neighborId);

              if (
                neighborRect &&
                hasPassedColumnMidpoint(
                  fromIndex,
                  stepIndex,
                  neighborRect,
                  pointerX,
                )
              ) {
                const nextOrder = arrayMove(order, fromIndex, stepIndex);
                columnDragOrderRef.current = nextOrder;
                setColumnDragOrder(nextOrder);
              }
            }
          }
        }

        // Keep sortable over on the active column so layout shifts come only
        // from columnDragOrder, not from dnd-kit transforms.
        return [{ id: active.id }];
      }

      const pointerCollisions = pointerWithin(args);

      if (pointerCollisions.length > 0) {
        const getType = (collision: (typeof pointerCollisions)[number]) => {
          const data = collision.data?.droppableContainer?.data?.current as
            | SortableOverData
            | undefined;

          return data?.type;
        };

        const cardCollision = pointerCollisions.find(
          (collision) => getType(collision) === "card",
        );
        if (cardCollision) {
          return [cardCollision];
        }

        const placeholderCollision = pointerCollisions.find(
          (collision) => getType(collision) === "placeholder",
        );
        if (placeholderCollision) {
          return [placeholderCollision];
        }

        return pointerCollisions;
      }

      return closestCorners(args);
    },
    [],
  );

  const activeCard: TaskCard | null = useMemo(() => {
    if (activeType !== "card" || !activeId) return null;

    return (
      board.columns
        .flatMap((column) => column.cards)
        .find((card) => card.id === activeId) ?? null
    );
  }, [activeId, activeType, board.columns]);

  const activeColumn: BoardColumn | null = useMemo(() => {
    if (activeType !== "column" || !activeId) return null;

    return board.columns.find((column) => column.id === activeId) ?? null;
  }, [activeId, activeType, board.columns]);

  const resetActive = useCallback(() => {
    stopAutoScroll();
    setActiveId(null);
    setActiveType(null);
    setActiveColumnCollapsed(false);
    setOverCardId(null);
    setOverColumnId(null);
    setInsertPosition(null);
    setIsColumnChromeDrop(false);
    pointerCoordinatesRef.current = null;
    columnDragOrderRef.current = null;
    setColumnDragOrder(null);
    clearStickyDrop();
    clearDropPreview();
  }, [clearDropPreview, clearStickyDrop, stopAutoScroll]);

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      const data = event.active.data.current as DragData | undefined;

      stopAutoScroll();
      setActiveId(event.active.id);
      setOverCardId(null);
      setOverColumnId(null);
      setInsertPosition(null);
      setIsColumnChromeDrop(false);
      pointerCoordinatesRef.current = null;
      columnDragOrderRef.current = null;
      setColumnDragOrder(null);
      clearStickyDrop();
      clearDropPreview();

      if (isCardData(data)) {
        setActiveType("card");
        setActiveColumnCollapsed(false);
        setOverColumnId(data.columnId);
        stickyDropRef.current = {
          columnId: data.columnId,
          overCardId: null,
          insertPosition: null,
          isColumnChromeDrop: false,
        };
        startColumnCardsAutoScroll();
        return;
      }

      if (isColumnData(data)) {
        setActiveType("column");
        setActiveColumnCollapsed(Boolean(data.isCollapsed));
        const order = board.columns.map((column) => column.id);
        columnDragOrderRef.current = order;
        setColumnDragOrder(order);
        startBoardAutoScroll();
      }
    },
    [
      board.columns,
      clearDropPreview,
      clearStickyDrop,
      startBoardAutoScroll,
      startColumnCardsAutoScroll,
      stopAutoScroll,
    ],
  );

  const updateForeignCardPreview = useCallback(
    (
      columnId: string,
      overCardIdValue: UniqueIdentifier,
      overRect: ClientRect,
      pointerY: number | null,
    ) => {
      const cardIds = getColumnCardIds(board.columns, columnId);
      const currentPreview = dropPreviewRef.current;
      const isNewColumn =
        !currentPreview || currentPreview.columnId !== columnId;

      if (isNewColumn) {
        const overIndex = cardIds.findIndex((id) => id === overCardIdValue);
        const middleFallback = "before" as CardInsertPosition;
        const position = getInsertPosition(overRect, pointerY, middleFallback);
        const insertIndex =
          overIndex === -1
            ? 0
            : position === "after"
              ? overIndex + 1
              : overIndex;

        updateDropPreview({
          columnId,
          order: insertPlaceholderAt(cardIds, insertIndex),
        });
        return;
      }

      // Swap when entering a card whose slot is not already the placeholder.
      // overCardId is cleared while over PH so moving back up onto the same
      // card can swap again; while still anchored on that card we no-op
      // to avoid flip-flop on repeated dragMove.
      if (stickyDropRef.current.overCardId === overCardIdValue) {
        return;
      }

      const placeholderIndex = currentPreview.order.indexOf(DROP_PLACEHOLDER_ID);
      const cardIndex = currentPreview.order.indexOf(overCardIdValue);

      if (
        placeholderIndex !== -1 &&
        cardIndex !== -1 &&
        placeholderIndex !== cardIndex
      ) {
        updateDropPreview({
          columnId,
          order: swapPlaceholderWithCard(currentPreview.order, overCardIdValue),
        });
      }
    },
    [board.columns, updateDropPreview],
  );

  const updateCardInsertTarget = useCallback(
    (event: DragOverEvent | DragMoveEvent) => {
      const { active, over } = event;
      const activeData = active.data.current as DragData | undefined;

      if (!isCardData(activeData)) {
        return;
      }

      if (!over) {
        setOverCardId(null);
        setOverColumnId(null);
        setInsertPosition(null);
        setIsColumnChromeDrop(false);
        clearStickyDrop();
        clearDropPreview();
        return;
      }

      if (active.id === over.id) {
        // Hovering the source ghost: keep column highlight, no blue end slot.
        setOverCardId(null);
        setInsertPosition(null);
        setIsColumnChromeDrop(false);
        setOverColumnId(activeData.columnId);
        stickyDropRef.current = {
          columnId: activeData.columnId,
          overCardId: null,
          insertPosition: null,
          isColumnChromeDrop: false,
        };
        clearDropPreview();
        return;
      }

      const overData = over.data.current as SortableOverData | undefined;
      const pointer = pointerCoordinatesRef.current;
      const pointerY = pointer?.y ?? null;

      // Hovering the blue gap keeps the drop target; clear card anchor so
      // moving back onto the same card (upward) can swap again.
      if (overData?.type === "placeholder") {
        if (dropPreviewRef.current) {
          stickyDropRef.current = {
            ...stickyDropRef.current,
            overCardId: null,
          };
          setOverCardId(null);
        }
        return;
      }

      if (overData?.type === "card" && overData.columnId) {
        const isForeignColumn = overData.columnId !== activeData.columnId;

        if (isForeignColumn) {
          updateForeignCardPreview(
            overData.columnId,
            over.id,
            over.rect,
            pointerY,
          );

          setStickyDrop({
            columnId: overData.columnId,
            overCardId: over.id,
            insertPosition: null,
            isColumnChromeDrop: false,
          });
          return;
        }

        clearDropPreview();

        const sourceIndex = findCardIndexInBoard(
          board.columns,
          activeData.columnId,
          active.id,
        );
        const overIndex = findCardIndexInBoard(
          board.columns,
          overData.columnId,
          over.id,
          overData.sortable?.index,
        );

        const middleFallback =
          stickyDropRef.current.overCardId === over.id
            ? (stickyDropRef.current.insertPosition ?? "before")
            : "before";

        const nextInsertPosition = resolveInsertNearGhost(
          activeData.columnId,
          sourceIndex,
          overData.columnId,
          overIndex,
          getInsertPosition(over.rect, pointerY, middleFallback),
        );

        setStickyDrop({
          columnId: overData.columnId,
          overCardId: over.id,
          insertPosition: nextInsertPosition,
          isColumnChromeDrop: false,
        });
        return;
      }

      if (overData?.type === "column") {
        const columnId = String(over.id);
        const isSourceColumn = columnId === activeData.columnId;

        // Same column: keep sticky placeholder (chrome/gaps must not move it).
        if (stickyDropRef.current.columnId === columnId) {
          setOverColumnId(columnId);
          return;
        }

        const insideCards = isPointerInsideColumnCards(columnId, pointer);

        if (isSourceColumn) {
          clearDropPreview();
          setStickyDrop({
            columnId,
            overCardId: null,
            insertPosition: null,
            isColumnChromeDrop: false,
          });
          return;
        }

        const cardIds = getColumnCardIds(board.columns, columnId);
        const isEndChrome = !insideCards;

        updateDropPreview({
          columnId,
          order: isEndChrome
            ? movePlaceholderToEnd(cardIds)
            : movePlaceholderToStart(cardIds),
        });

        setStickyDrop({
          columnId,
          overCardId: null,
          insertPosition: null,
          isColumnChromeDrop: isEndChrome,
        });
        return;
      }

      if (overData?.sortable?.containerId) {
        const targetColumnId = String(overData.sortable.containerId);
        const isForeignColumn = targetColumnId !== activeData.columnId;

        if (isForeignColumn) {
          updateForeignCardPreview(
            targetColumnId,
            over.id,
            over.rect,
            pointerY,
          );

          setStickyDrop({
            columnId: targetColumnId,
            overCardId: over.id,
            insertPosition: null,
            isColumnChromeDrop: false,
          });
          return;
        }

        clearDropPreview();

        const sourceIndex = findCardIndexInBoard(
          board.columns,
          activeData.columnId,
          active.id,
        );
        const overIndex = findCardIndexInBoard(
          board.columns,
          targetColumnId,
          over.id,
          overData.sortable.index,
        );

        const middleFallback =
          stickyDropRef.current.overCardId === over.id
            ? (stickyDropRef.current.insertPosition ?? "before")
            : "before";

        const nextInsertPosition = resolveInsertNearGhost(
          activeData.columnId,
          sourceIndex,
          targetColumnId,
          overIndex,
          getInsertPosition(over.rect, pointerY, middleFallback),
        );

        setStickyDrop({
          columnId: targetColumnId,
          overCardId: over.id,
          insertPosition: nextInsertPosition,
          isColumnChromeDrop: false,
        });
        return;
      }

      setOverCardId(null);
      setOverColumnId(null);
      setInsertPosition(null);
      setIsColumnChromeDrop(false);
      clearStickyDrop();
      clearDropPreview();
    },
    [
      board.columns,
      clearDropPreview,
      clearStickyDrop,
      setStickyDrop,
      updateForeignCardPreview,
      updateDropPreview,
    ],
  );

  const onDragOver = useCallback(
    (event: DragOverEvent) => {
      updateCardInsertTarget(event);
    },
    [updateCardInsertTarget],
  );

  const onDragMove = useCallback(
    (event: DragMoveEvent) => {
      updateCardInsertTarget(event);
    },
    [updateCardInsertTarget],
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      const pointerY = pointerCoordinatesRef.current?.y ?? null;
      const dropOverCardId = overCardId;
      const dropOverColumnId = overColumnId;
      const dropInsertPosition = insertPosition;
      const previewSnapshot = dropPreviewRef.current;
      const dragOrderSnapshot = columnDragOrderRef.current;

      resetActive();

      const activeData = active.data.current as DragData | undefined;
      const overData = over?.data.current as SortableOverData | undefined;

      if (isColumnData(activeData)) {
        if (!dragOrderSnapshot) return;

        const targetIndex = dragOrderSnapshot.indexOf(active.id);

        if (targetIndex === -1) return;

        const sourceIndex = board.columns.findIndex(
          (column) => column.id === active.id,
        );

        if (sourceIndex === -1 || sourceIndex === targetIndex) return;

        onMoveColumn(String(active.id), targetIndex);
        return;
      }

      if (!over || active.id === over.id) return;

      if (!isCardData(activeData)) return;

      const sourceColumnId =
        activeData.columnId || findColumnIdForCard(board, active.id);

      if (!sourceColumnId) return;

      let targetColumnId: string | null = null;
      let targetIndex = 0;

      const sourceIndex = findCardIndexInBoard(
        board.columns,
        sourceColumnId,
        active.id,
      );

      // Foreign column: drop at the placeholder index from the swap preview.
      if (
        previewSnapshot &&
        previewSnapshot.columnId !== sourceColumnId
      ) {
        targetColumnId = previewSnapshot.columnId;
        const placeholderIndex = previewSnapshot.order.indexOf(
          DROP_PLACEHOLDER_ID,
        );
        targetIndex =
          placeholderIndex === -1
            ? previewSnapshot.order.length
            : placeholderIndex;
      } else if (overData?.type === "placeholder") {
        targetColumnId =
          overData.columnId ??
          (dropOverColumnId ? String(dropOverColumnId) : null);

        const anchorCardId = overData.anchorCardId ?? dropOverCardId;
        const position = overData.insertPosition ?? dropInsertPosition;

        if (!targetColumnId) return;

        if (!anchorCardId || !position) {
          const targetColumn = board.columns.find(
            (column) => column.id === targetColumnId,
          );
          targetIndex = targetColumn?.cards.length ?? 0;
        } else {
          const overIndex = findCardIndexInBoard(
            board.columns,
            targetColumnId,
            anchorCardId,
          );

          if (overIndex === -1) return;

          targetIndex = resolveCardTargetIndex(
            overIndex,
            position,
            sourceColumnId,
            targetColumnId,
            sourceIndex,
          );
        }
      } else if (overData?.type === "card" && overData.columnId) {
        targetColumnId = overData.columnId;
        const overIndex = findCardIndexInBoard(
          board.columns,
          targetColumnId,
          over.id,
          overData.sortable?.index,
        );
        const dropPosition = resolveInsertNearGhost(
          sourceColumnId,
          sourceIndex,
          targetColumnId,
          overIndex,
          getInsertPosition(
            over.rect,
            pointerY,
            dropInsertPosition ?? "before",
          ),
        );

        targetIndex = resolveCardTargetIndex(
          overIndex,
          dropPosition,
          sourceColumnId,
          targetColumnId,
          sourceIndex,
        );
      } else if (overData?.type === "column") {
        targetColumnId = String(over.id);
        const targetColumn = board.columns.find(
          (column) => column.id === targetColumnId,
        );
        targetIndex = targetColumn?.cards.length ?? 0;
      } else if (overData?.sortable?.containerId) {
        targetColumnId = String(overData.sortable.containerId);
        const overIndex = findCardIndexInBoard(
          board.columns,
          targetColumnId,
          over.id,
          overData.sortable.index,
        );
        const dropPosition = resolveInsertNearGhost(
          sourceColumnId,
          sourceIndex,
          targetColumnId,
          overIndex,
          getInsertPosition(
            over.rect,
            pointerY,
            dropInsertPosition ?? "before",
          ),
        );

        targetIndex = resolveCardTargetIndex(
          overIndex,
          dropPosition,
          sourceColumnId,
          targetColumnId,
          sourceIndex,
        );
      } else {
        const maybeColumn = board.columns.find(
          (column) => column.id === over.id,
        );
        if (maybeColumn) {
          targetColumnId = maybeColumn.id;
          targetIndex = maybeColumn.cards.length;
        }
      }

      if (!targetColumnId) return;

      if (sourceColumnId === targetColumnId && sourceIndex === targetIndex) {
        return;
      }

      onMoveCard(
        String(active.id),
        sourceColumnId,
        targetColumnId,
        targetIndex,
      );
    },
    [
      board,
      insertPosition,
      onMoveCard,
      onMoveColumn,
      overCardId,
      overColumnId,
      resetActive,
    ],
  );

  const onDragCancel = useCallback(() => {
    resetActive();
  }, [resetActive]);

  return {
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
  };
};
