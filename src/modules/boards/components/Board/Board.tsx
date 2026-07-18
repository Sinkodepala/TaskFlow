import type { Board as BoardType } from "@/types/board";
import type { CreateCardFormValues } from "@/modules/boards/types/cardForm.types";
import { BoardColumn } from "@/modules/boards/components/BoardColumn/BoardColumn";

import styles from "./Board.module.scss";

interface BoardProps {
  board: BoardType;
  onAddCard: (columnId: string, data: CreateCardFormValues) => void;
}

export const Board = ({ board, onAddCard }: BoardProps) => {
  return (
    <div>
      <h2>{board.title}</h2>
      <p>{board.description}</p>
      <div className={styles.board}>
        {board.columns.map((column) => (
          <BoardColumn key={column.id} column={column} onAddCard={onAddCard} />
        ))}
      </div>
    </div>
  );
};
