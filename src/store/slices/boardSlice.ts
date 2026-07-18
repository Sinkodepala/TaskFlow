import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Workspace } from "@/types/workspace";
import { mockWorkspace } from "@/modules/boards/mock/boards.mock";
import type { AddCardPayload } from "./board.types";

interface BoardState {
  workspace: Workspace;
}

const initialState: BoardState = {
  workspace: mockWorkspace,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    // Workspace

    setWorkspace(state, action: PayloadAction<Workspace>) {
      state.workspace = action.payload;
    },

    // Board

    // Column

    // Card

    addCard(state, action: PayloadAction<AddCardPayload>) {
      const { boardId, columnId, card } = action.payload;
      const board = state.workspace.boards.find(
        (board) => board.id === boardId,
      );
      const column = board?.columns.find((column) => column.id === columnId);

      column?.cards.push(card);
    },
  },
});

export const { setWorkspace, addCard } = boardSlice.actions;

export default boardSlice.reducer;
