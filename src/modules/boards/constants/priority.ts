import type { TaskPriority } from "@/types/card";

export const priorityConfig: Record<
  TaskPriority,
  { color: string; label: string }
> = {
  low: {
    color: "green",
    label: "Низкий",
  },
  medium: {
    color: "orange",
    label: "Средний",
  },
  high: {
    color: "red",
    label: "Высокий",
  },
};

export const priorityOptions = (
  Object.entries(priorityConfig) as [
    TaskPriority,
    { color: string; label: string },
  ][]
).map(([value, config]) => ({
  value,
  label: config.label,
}));
