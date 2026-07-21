import { CollapseIcon } from "@/modules/boards/components/ui/CollapseIcon/CollapseIcon";

import styles from "./BoardColumnOverlay.module.scss";

interface BoardColumnOverlayProps {
  title: string;
  count: number;
  isCollapsed?: boolean;
}

export const BoardColumnOverlay = ({
  title,
  count,
  isCollapsed = false,
}: BoardColumnOverlayProps) => {
  if (isCollapsed) {
    return (
      <div className={`${styles.columnOverlay} ${styles.collapsed}`}>
        <div className={styles.collapsedHeader}>
          <div className={styles.collapseButton}>
            <CollapseIcon collapsed={true} />
          </div>
          <div className={styles.collapsedTitle}>
            <h2>{title}</h2>
          </div>
          <span className={styles.count}>{count}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.columnOverlay}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.count}>{count}</span>
      </div>
      <div className={styles.body}>Перетаскивание колонки…</div>
    </div>
  );
};
