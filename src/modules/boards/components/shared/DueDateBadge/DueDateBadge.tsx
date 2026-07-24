import { getDueDateStatus } from "@/modules/boards/utils/getDueDateStatus";
import { formatDateTime } from "@/modules/boards/utils/formatDate";

import styles from "./DueDateBadge.module.scss";

interface DueDateBadgeProps {
  dueDate: string;
}

const statusClass: Record<string, string | undefined> = {
  overdue: styles.overdue,
  soon: styles.soon,
  normal: undefined,
};

export const DueDateBadge = ({ dueDate }: DueDateBadgeProps) => {
  const status = getDueDateStatus(dueDate);

  return (
    <span className={`${styles.badge} ${statusClass[status] ?? ""}`}>
      {formatDateTime(dueDate)}
    </span>
  );
};
