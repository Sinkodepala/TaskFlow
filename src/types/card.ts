export type TaskStatus = "todo" | "inProgress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskCard {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}