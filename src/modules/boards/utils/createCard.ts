import type { TaskCard } from "@/types/card";
import type { CreateCardFormValues } from "@/modules/boards/types/cardForm.types";

export const createCard = (data: CreateCardFormValues): TaskCard => {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description,
    status: "todo",
    priority: data.priority,
    dueDate: "",
    createdAt: now,
    updatedAt: now,
  };
};
