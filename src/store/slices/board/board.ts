// Board reducers slice for board state

import { createSlice } from "@reduxjs/toolkit";

import type { Workspace } from "@/types/workspace";
import { mockWorkspace } from "@/modules/boards/mock/boards.mock";

export interface BoardState {
  workspace: Workspace;
}

const initialState: BoardState = {
  workspace: mockWorkspace,
};

const BoardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {},
});

export default BoardSlice.reducer;
