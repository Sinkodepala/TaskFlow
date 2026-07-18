import type { MenuProps } from "antd";
import type { Key, ReactNode } from "react";
import {
  HomeOutlined,
  AppstoreOutlined,
  StarOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { routes } from "@/router/routes";

export type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: ReactNode,
  key: Key,
  icon?: ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export const sidebarItems: MenuItem[] = [
  getItem("Главная", routes.home, <HomeOutlined />),
  getItem("Доски", routes.board("1"), <AppstoreOutlined />),
  getItem("Избранное", routes.favorites, <StarOutlined />),
  getItem("Настройки", routes.settings, <SettingOutlined />),
];
