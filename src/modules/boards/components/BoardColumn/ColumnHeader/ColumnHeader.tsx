import { CollapseIcon } from "@/modules/boards/components/ui/CollapseIcon/CollapseIcon";

import styles from "./ColumnHeader.module.scss";

interface ColumnHeaderProps {
  title: string;
  count: number;
  onCollapse: () => void;
}

export const ColumnHeader = ({
  title,
  count,
  onCollapse,
}: ColumnHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <h2>{title}</h2>
      </div>
      <div className={styles.actions}>
        <span className={styles.count}>{count}</span>

        <button className={styles.collapseButton} onClick={onCollapse}>
          <CollapseIcon collapsed={false}/>
        </button>

        <button className={styles.menuButton}>⋮</button>
      </div>
    </div>
  );
};
