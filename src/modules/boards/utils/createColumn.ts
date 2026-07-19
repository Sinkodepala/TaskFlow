import type { BoardColumn } from "@/types/column";
import type { CreateColumnFormValues } from "@/modules/boards/types/columnForm.types";

export const createColumn = (data: CreateColumnFormValues): BoardColumn => {
  return {
    id: crypto.randomUUID(),
    title: data.title,
    cards: [],
  };
};
