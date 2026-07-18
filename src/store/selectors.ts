import type { RootState } from './index';

export const selectWorkspace = (state: RootState) => state.board.workspace;

export const selectBoards = (state: RootState) => state.board.workspace.boards

export const selectBoardById = (state: RootState) => state.board.workspace.boards[0]