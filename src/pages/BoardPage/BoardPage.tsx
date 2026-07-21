import { Board } from "@/modules/boards/components/Board/Board";
import { useBoard } from "@/modules/boards/hooks/useBoard";

export const BoardPage = () => {
  const {
    board,
    handleNewCard,
    handleUpdateCard,
    handleDeleteCard,
    handleAddColumn,
    handleRenameColumn,
    handleDeleteColumn,
    handleMoveCard,
    handleMoveColumn,
  } = useBoard();

  if (!board) {
    return <div>Доска не найдена</div>;
  }

  return (
    <Board
      board={board}
      onAddCard={handleNewCard}
      onUpdateCard={handleUpdateCard}
      onDeleteCard={handleDeleteCard}
      onAddColumn={handleAddColumn}
      onRenameColumn={handleRenameColumn}
      onDeleteColumn={handleDeleteColumn}
      onMoveCard={handleMoveCard}
      onMoveColumn={handleMoveColumn}
    />
  );
};
