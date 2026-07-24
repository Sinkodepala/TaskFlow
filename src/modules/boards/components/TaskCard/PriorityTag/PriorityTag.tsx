import { Tag } from "antd";

import type { TaskPriority } from "@/types/card";
import { priorityConfig } from "@/modules/boards/constants/priority";

interface PriorityTagProps {
  priority: TaskPriority;
}

export const PriorityTag = ({ priority }: PriorityTagProps) => {
  const config = priorityConfig[priority];

  return <Tag color={config.color}>{config.label}</Tag>;
};
