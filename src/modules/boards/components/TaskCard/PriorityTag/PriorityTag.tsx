import { Tag } from "antd";

import type { TaskPriority } from "@/types/card";

interface PriorityTagProps {
  priority: TaskPriority;
}

const priorityConfig = {
  low: {
    color: "green",
    label: "Low",
  },
  medium: {
    color: "orange",
    label: "Medium",
  },
  high: {
    color: "red",
    label: "High",
  },
};

export const PriorityTag = ({ priority }: PriorityTagProps) => {
  const config = priorityConfig[priority]

  return (
    <Tag color={config.color}>{config.label}</Tag>
  )
}