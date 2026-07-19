import { Tag } from "antd";

import type { TaskPriority } from "@/types/card";

interface PriorityTagProps {
  priority: TaskPriority;
}

const priorityConfig = {
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

export const PriorityTag = ({ priority }: PriorityTagProps) => {
  const config = priorityConfig[priority]

  return (
    <Tag color={config.color}>{config.label}</Tag>
  )
}