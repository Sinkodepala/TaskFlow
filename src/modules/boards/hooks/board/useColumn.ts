import { useAppDispatch } from "@/store/hooks";
import {
  addColumn,
  deleteColumn,
  updateColumnTitle,
} from "@/store/slices/board";
import { createColumn } from "@/modules/boards/utils/createColumn";

import type { Board } from "@/types/board";
import type {
  CreateColumnFormValues,
  RenameColumnFormValues,
} from "@/modules/boards/types/columnForm.types";

export const useColumn = (board: Board | undefined) => {
  const dispatch = useAppDispatch();

  const handleAddColumn = (data: CreateColumnFormValues) => {
    if (!board) return;

    dispatch(
      addColumn({
        boardId: board.id,
        column: createColumn(data),
      }),
    );
  };

  const handleRenameColumn = (
    columnId: string,
    data: RenameColumnFormValues,
  ) => {
    if (!board) return;

    dispatch(
      updateColumnTitle({
        boardId: board.id,
        columnId,
        title: data.title,
      }),
    );
  };

  const handleDeleteColumn = (columnId: string) => {
    if (!board) return;

    dispatch(
      deleteColumn({
        boardId: board.id,
        columnId,
      }),
    );
  };

  return {
    handleAddColumn,
    handleRenameColumn,
    handleDeleteColumn,
  };
};
