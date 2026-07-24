// Column reducers slice for column state

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Workspace } from "@/types/workspace";
import { mockWorkspace } from "@/modules/boards/mock/boards.mock";
import type {
  AddColumnPayload,
  DeleteColumnPayload,
  UpdateColumnTitlePayload,
} from "./board.types";

export interface ColumnState {
  workspace: Workspace;
}

const initialState: ColumnState = {
  workspace: mockWorkspace,
};

const ColumnSlice = createSlice({
  name: "column",
  initialState,
  reducers: {
    addColumn(state, action: PayloadAction<AddColumnPayload>) {
      const { boardId, column } = action.payload;
      const board = state.workspace.boards.find(
        (board) => board.id === boardId,
      );

      board?.columns.push(column);
    },

    updateColumnTitle(state, action: PayloadAction<UpdateColumnTitlePayload>) {
      const { boardId, columnId, title } = action.payload;
      const board = state.workspace.boards.find(
        (board) => board.id === boardId,
      );
      const column = board?.columns.find((column) => column.id === columnId);

      if (!column) return;

      column.title = title;
    },

    deleteColumn(state, action: PayloadAction<DeleteColumnPayload>) {
      const { boardId, columnId } = action.payload;
      const board = state.workspace.boards.find(
        (board) => board.id === boardId,
      );

      if (!board) return;

      const columnIndex = board.columns.findIndex(
        (column) => column.id === columnId,
      );

      if (columnIndex === -1) return;

      board.columns.splice(columnIndex, 1);
    },
  },
});

export const { addColumn, updateColumnTitle, deleteColumn } =
  ColumnSlice.actions;
export default ColumnSlice.reducer;
