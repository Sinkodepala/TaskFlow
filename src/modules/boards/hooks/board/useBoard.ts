import { useAppSelector } from "@/store/hooks";
import { selectBoardById } from "@/store/selectors";
import { useCard } from "@/modules/boards/hooks/board/useCard";
import { useColumn } from "@/modules/boards/hooks/board/useColumn";

export const useBoard = () => {
  const board = useAppSelector(selectBoardById);
  const card = useCard(board);
  const column = useColumn(board);

  return {
    board,
    ...card,
    ...column,
  };
};
