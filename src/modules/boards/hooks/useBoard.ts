import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectBoardById } from "@/store/selectors";
import { addCard } from "@/store/slices/boardSlice";
import { createCard } from "@/modules/boards/utils/createCard";

import type { CreateCardFormValues } from "@/modules/boards/types/cardForm.types";

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

  return {
    board,
    handleNewCard,
  };
};
