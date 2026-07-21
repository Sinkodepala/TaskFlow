import type { TaskCard, TaskPriority, TaskStatus } from "@/types/card";
import type { BoardColumn } from "@/types/column";

export interface AddCardPayload {
  boardId: string;
  columnId: string;
  card: TaskCard;
}

export interface UpdateCardPayload {
  boardId: string;
  cardId: string;
  columnId: string;
  data: {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
    status: TaskStatus;
  };
}

export interface DeleteCardPayload {
  boardId: string;
  cardId: string;
}

export interface AddColumnPayload {
  boardId: string;
  column: BoardColumn;
}

export interface UpdateColumnTitlePayload {
  boardId: string;
  columnId: string;
  title: string;
}

export interface DeleteColumnPayload {
  boardId: string;
  columnId: string;
}

export interface MoveCardPayload {
  boardId: string;
  cardId: string;
  sourceColumnId: string;
  targetColumnId: string;
  targetIndex: number;
}

export interface MoveColumnPayload {
  boardId: string;
  columnId: string;
  targetIndex: number;
}
