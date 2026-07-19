import type { TaskStatus } from "@/types/card";

const columnTitleToStatus: Record<string, TaskStatus> = {
  "To Do": "todo",
  "In Progress": "inProgress",
  Done: "done",
};

export const getStatusForColumnTitle = (
  columnTitle: string,
  fallbackStatus: TaskStatus,
): TaskStatus => {
  return columnTitleToStatus[columnTitle] ?? fallbackStatus;
};
