import type { Action } from "@reduxjs/toolkit";

import workspaceReducer, { setWorkspace } from "./workspace";
import type { WorkspaceState } from "./workspace";
import boardReducer from "./board";
import columnReducer, {
  addColumn,
  updateColumnTitle,
  deleteColumn,
} from "./column";
import cardReducer, { addCard, updateCard, deleteCard } from "./card";

export type { WorkspaceState as BoardState };

export {
  setWorkspace,
  addColumn,
  updateColumnTitle,
  deleteColumn,
  addCard,
  updateCard,
  deleteCard,
};

/** All entity slices share one workspace state — chain them instead of combineReducers */
export default function boardReducerCombined(
  state: WorkspaceState | undefined,
  action: Action,
): WorkspaceState {
  state = workspaceReducer(state, action);
  state = boardReducer(state, action);
  state = columnReducer(state, action);
  state = cardReducer(state, action);

  return state;
}
