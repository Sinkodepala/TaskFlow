import type { TaskCard } from "@/types/card";

export interface AddCardPayload {
    boardId: string;
    columnId: string;
    card: TaskCard;
}