import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectBoardById } from "@/store/selectors";
import {
  addCard,
  addColumn,
  deleteCard,
  updateCard,
} from "@/store/slices/boardSlice";
import { createCard } from "@/modules/boards/utils/createCard";
import { createColumn } from "@/modules/boards/utils/createColumn";
import { getStatusForColumnTitle } from "@/modules/boards/utils/getStatusForColumnTitle";

import type {
  CreateCardFormValues,
  EditCardFormValues,
} from "@/modules/boards/types/cardForm.types";
import type { CreateColumnFormValues } from "@/modules/boards/types/columnForm.types";

export const useBoard = () => {
  const dispatch = useAppDispatch();
  const board = useAppSelector(selectBoardById);

  const handleNewCard = (columnId: string, data: CreateCardFormValues) => {
    dispatch(
      addCard({
        boardId: board?.id ?? "",
        columnId,
        card: createCard(data),
      }),
    );
  };

  const handleUpdateCard = (cardId: string, data: EditCardFormValues) => {
    if (!board) return;

    const currentCard = board.columns
      .flatMap((column) => column.cards)
      .find((card) => card.id === cardId);

    if (!currentCard) return;

    const targetColumn = board.columns.find(
      (column) => column.id === data.columnId,
    );

    if (!targetColumn) return;

    dispatch(
      updateCard({
        boardId: board.id,
        cardId,
        columnId: data.columnId,
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          dueDate: data.dueDate ? data.dueDate.format("YYYY-MM-DD") : "",
          status: getStatusForColumnTitle(
            targetColumn.title,
            currentCard.status,
          ),
        },
      }),
    );
  };

  const handleDeleteCard = (cardId: string) => {
    if (!board) return;

    dispatch(
      deleteCard({
        boardId: board.id,
        cardId,
      }),
    );
  };

  const handleAddColumn = (data: CreateColumnFormValues) => {
    if (!board) return;

    dispatch(
      addColumn({
        boardId: board.id,
        column: createColumn(data),
      }),
    );
  };

  return {
    board,
    handleNewCard,
    handleUpdateCard,
    handleDeleteCard,
    handleAddColumn,
  };
};
