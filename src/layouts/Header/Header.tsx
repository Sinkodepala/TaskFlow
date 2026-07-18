import { Layout, Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons"

import styles from './Header.module.scss';

type HeaderProps = {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

const { Header: AntHeader } = Layout;

export const Header = ({collapsed, onToggleSidebar}: HeaderProps) => {
  return (
    <AntHeader className={styles.header}>
      <Button
      type="text"
      size="large"
      onClick={onToggleSidebar}
      >
      {
        collapsed
          ? <MenuUnfoldOutlined />
          : <MenuFoldOutlined />
        }
      </Button>
    </AntHeader>
  );
}