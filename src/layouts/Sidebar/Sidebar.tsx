import { Layout } from 'antd';

import { Logo } from './Logo';
import { Navigation } from './Navigation';

import styles from './Sidebar.module.scss';

type SidebarProps = {
  collapsed: boolean;
  onCollapse: (value: boolean) => void;
}

const { Sider } = Layout;

export const Sidebar = ({collapsed, onCollapse}: SidebarProps) => {
  return (
    <Sider
    className={styles.sider}
    theme="light"
    collapsed={collapsed}
    collapsible
    onCollapse={onCollapse}
    trigger={null}
    >
      <Logo collapsed={collapsed}/>
      <Navigation />
    </Sider>
  );
};