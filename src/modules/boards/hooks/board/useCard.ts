import { useAppDispatch } from "@/store/hooks";
import { addCard, deleteCard, updateCard } from "@/store/slices/board";
import { createCard } from "@/modules/boards/utils/createCard";
import { getStatusForColumnTitle } from "@/modules/boards/utils/getStatusForColumnTitle";

import type { Board } from "@/types/board";
import type {
  CreateCardFormValues,
  EditCardFormValues,
} from "@/modules/boards/types/cardForm.types";

export const useCard = (board: Board | undefined) => {
  const dispatch = useAppDispatch();

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
          dueDate: data.dueDate ? data.dueDate.format("YYYY-MM-DDTHH:mm") : "",
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

  return {
    handleNewCard,
    handleUpdateCard,
    handleDeleteCard,
  };
};
