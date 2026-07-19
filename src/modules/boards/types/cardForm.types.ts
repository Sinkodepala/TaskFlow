import type { TaskPriority } from "@/types/card";
import type { Dayjs } from "dayjs";

export interface CreateCardFormValues {
  title: string;
  description: string;
  priority: TaskPriority;
}

export interface EditCardFormValues {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: Dayjs | null;
  columnId: string;
}
