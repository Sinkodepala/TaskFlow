import type { HTMLAttributes } from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

import { CollapseIcon } from "@/modules/boards/components/ui/CollapseIcon/CollapseIcon";

import styles from "./ColumnHeader.module.scss";

interface ColumnHeaderProps {
  title: string;
  count: number;
  onCollapse: () => void;
  onRename: () => void;
  onDelete: () => void;
  dragHandleProps?: HTMLAttributes<HTMLDivElement>;
}

export const ColumnHeader = ({
  title,
  count,
  onCollapse,
  onRename,
  onDelete,
  dragHandleProps,
}: ColumnHeaderProps) => {
  const menuItems: MenuProps["items"] = [
    {
      key: "rename",
      label: "Переименовать",
      onClick: ({ domEvent }) => {
        domEvent.stopPropagation();
        onRename();
      },
    },
    {
      key: "delete",
      label: "Удалить",
      danger: true,
      onClick: ({ domEvent }) => {
        domEvent.stopPropagation();
        onDelete();
      },
    },
  ];

  return (
    <div className={styles.header}>
      <div className={styles.title} {...dragHandleProps}>
        <h2>{title}</h2>
      </div>
      <div className={styles.actions}>
        <span className={styles.count}>{count}</span>

        <button
          className={styles.collapseButton}
          type="button"
          onClick={onCollapse}
        >
          <CollapseIcon collapsed={false} />
        </button>

        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <button
            className={styles.menuButton}
            type="button"
            onClick={(event) => event.stopPropagation()}
          >
            ⋮
          </button>
        </Dropdown>
      </div>
    </div>
  );
};
