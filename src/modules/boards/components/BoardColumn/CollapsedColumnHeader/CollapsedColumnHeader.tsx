import { CollapseIcon } from "@/modules/boards/components/ui/CollapseIcon/CollapseIcon";

import styles from "./CollapsedColumnHeader.module.scss";

interface CollapsedColumnHeaderProps {
  title: string;
  count: number;
}

export const CollapsedColumnHeader = ({
  title,
  count,
}: CollapsedColumnHeaderProps) => {
  return (
    <div className={styles.collapsedHeader}>
      <button className={styles.collapseButton}>
        <CollapseIcon collapsed={true} />
      </button>

      <div className={styles.title}>
        <h2>{title}</h2>
      </div>

      <span className={styles.count}>{count}</span>
    </div>
  );
};
