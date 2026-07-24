// Card reducers slice for card state

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Workspace } from "@/types/workspace";
import { mockWorkspace } from "@/modules/boards/mock/boards.mock";
import type {
  AddCardPayload,
  UpdateCardPayload,
  DeleteCardPayload,
} from "./board.types";

export interface CardState {
  workspace: Workspace;
}

const initialState: CardState = {
  workspace: mockWorkspace,
};

const CardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
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
  },
});

export const { addCard, updateCard, deleteCard } = CardSlice.actions;
export default CardSlice.reducer;
