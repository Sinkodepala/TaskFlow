// Workspace reducers slice for workspace state

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Workspace } from "@/types/workspace";
import { mockWorkspace } from "@/modules/boards/mock/boards.mock";

export interface WorkspaceState {
  workspace: Workspace;
}

const initialState: WorkspaceState = {
  workspace: mockWorkspace,
};

const WorkspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspace(state, action: PayloadAction<Workspace>) {
      state.workspace = action.payload;
    },
  },
});

export const { setWorkspace } = WorkspaceSlice.actions;
export default WorkspaceSlice.reducer;
