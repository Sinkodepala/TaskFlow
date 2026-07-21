import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Workspace } from "@/types/workspace";
import { mockWorkspace } from "@/modules/boards/mock/boards.mock";
import { getStatusForColumnTitle } from "@/modules/boards/utils/getStatusForColumnTitle";
import type {
  AddCardPayload,
  AddColumnPayload,
  DeleteCardPayload,
  DeleteColumnPayload,
  MoveCardPayload,
  MoveColumnPayload,
  UpdateCardPayload,
  UpdateColumnTitlePayload,
} from "./board.types";

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

    // Card

    addCard(state, action: PayloadAction<AddCardPayload>) {
      const { boardId, columnId, card } = action.payload;
      const board = state.workspace.boards.find(
        (board) => board.id === boardId,
      );
      const column = board?.columns.find((column) => column.id === columnId);

      column?.cards.push(card);
    },

    updateCard(state, action: PayloadAction<UpdateCardPayload>) {
      const { boardId, cardId, columnId, data } = action.payload;
      const board = state.workspace.boards.find(
        (board) => board.id === boardId,
      );

      if (!board) return;

      let sourceColumn = null;
      let cardIndex = -1;

      for (const column of board.columns) {
        const index = column.cards.findIndex((card) => card.id === cardId);

        if (index !== -1) {
          sourceColumn = column;
          cardIndex = index;
          break;
        }
      }

      if (!sourceColumn || cardIndex === -1) return;

      const targetColumn = board.columns.find(
        (column) => column.id === columnId,
      );

      if (!targetColumn) return;

      const updatedCard = {
        ...sourceColumn.cards[cardIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      if (sourceColumn.id === targetColumn.id) {
        sourceColumn.cards[cardIndex] = updatedCard;
        return;
      }

      sourceColumn.cards.splice(cardIndex, 1);
      targetColumn.cards.push(updatedCard);
    },

    deleteCard(state, action: PayloadAction<DeleteCardPayload>) {
      const { boardId, cardId } = action.payload;
      const board = state.workspace.boards.find(
        (board) => board.id === boardId,
      );

      if (!board) return;

      for (const column of board.columns) {
        const cardIndex = column.cards.findIndex((card) => card.id === cardId);

        if (cardIndex !== -1) {
          column.cards.splice(cardIndex, 1);
          return;
        }
      }
    },

    moveCard(state, action: PayloadAction<MoveCardPayload>) {
      const {
        boardId,
        cardId,
        sourceColumnId,
        targetColumnId,
        targetIndex,
      } = action.payload;
      const board = state.workspace.boards.find(
        (board) => board.id === boardId,
      );

      if (!board) return;

      const sourceColumn = board.columns.find(
        (column) => column.id === sourceColumnId,
      );
      const targetColumn = board.columns.find(
        (column) => column.id === targetColumnId,
      );

      if (!sourceColumn || !targetColumn) return;

      const sourceIndex = sourceColumn.cards.findIndex(
        (card) => card.id === cardId,
      );

      if (sourceIndex === -1) return;

      const [card] = sourceColumn.cards.splice(sourceIndex, 1);

      if (!card) return;

      const insertIndex = Math.max(
        0,
        Math.min(targetIndex, targetColumn.cards.length),
      );

      const movedCard =
        sourceColumnId === targetColumnId
          ? { ...card, updatedAt: new Date().toISOString() }
          : {
              ...card,
              status: getStatusForColumnTitle(targetColumn.title, card.status),
              updatedAt: new Date().toISOString(),
            };

      targetColumn.cards.splice(insertIndex, 0, movedCard);
    },

    moveColumn(state, action: PayloadAction<MoveColumnPayload>) {
      const { boardId, columnId, targetIndex } = action.payload;
      const board = state.workspace.boards.find(
        (board) => board.id === boardId,
      );

      if (!board) return;

      const sourceIndex = board.columns.findIndex(
        (column) => column.id === columnId,
      );

      if (sourceIndex === -1) return;

      const [column] = board.columns.splice(sourceIndex, 1);

      if (!column) return;

      const insertIndex = Math.max(
        0,
        Math.min(targetIndex, board.columns.length),
      );

      board.columns.splice(insertIndex, 0, column);
    },
  },
});

export const {
  setWorkspace,
  addColumn,
  updateColumnTitle,
  deleteColumn,
  addCard,
  updateCard,
  deleteCard,
  moveCard,
  moveColumn,
} = boardSlice.actions;
export default boardSlice.reducer;
