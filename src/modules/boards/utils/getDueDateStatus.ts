export type DueDateStatus = "overdue" | "soon" | "normal";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const getDueDateStatus = (dueDate: string): DueDateStatus => {
  const dueTime = new Date(dueDate).getTime();

  if (Number.isNaN(dueTime)) return "normal";

  const diff = dueTime - Date.now();

  if (diff < 0) return "overdue";
  if (diff <= ONE_DAY_MS) return "soon";

  return "normal";
};
