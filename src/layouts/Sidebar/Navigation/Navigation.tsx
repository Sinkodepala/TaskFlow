import { Menu } from "antd";

import { useLocation, useNavigate } from "react-router-dom";

import { sidebarItems } from "../sidebarItems";

import styles from "./Navigation.module.scss"

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className={styles.navigation}>
      <Menu
      mode="inline"
      items={sidebarItems}
      selectedKeys={[location.pathname]}
      onClick={(item) => navigate(item.key)}/>
      </div>
  )
}