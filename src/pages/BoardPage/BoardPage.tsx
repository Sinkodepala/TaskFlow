import { Board } from "@/modules/boards/components/Board/Board";
import { useBoard } from "@/modules/boards/hooks/board/useBoard";

export const BoardPage = () => {
  const {
    board,
    handleNewCard,
    handleUpdateCard,
    handleDeleteCard,
    handleAddColumn,
    handleRenameColumn,
    handleDeleteColumn,
  } = useBoard();

  if (!board) {
    return <div>Доска не найдена</div>;
  }

  return (
    <Board
      board={board}
      cardActions={{
        onAdd: handleNewCard,
        onUpdate: handleUpdateCard,
        onDelete: handleDeleteCard,
      }}
      columnActions={{
        onAdd: handleAddColumn,
        onRename: handleRenameColumn,
        onDelete: handleDeleteColumn,
      }}
    />
  );
};
