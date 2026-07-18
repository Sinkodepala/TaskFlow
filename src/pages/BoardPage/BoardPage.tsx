import { Board } from "@/modules/boards/components/Board/Board";
import { useBoard } from "@/modules/boards/hooks/useBoard";

export const BoardPage = () => {
  const { board, handleNewCard } = useBoard();

  if (!board) {
    return <div>Board not found</div>;
  }

  return (
    <>
      <Board board={board} onAddCard={handleNewCard} />
    </>
  );
};
