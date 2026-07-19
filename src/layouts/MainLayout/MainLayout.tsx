import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Header } from '@/layouts/Header';
import { Sidebar } from '@/layouts/Sidebar';
import { Layout } from 'antd';

import styles from './MainLayout.module.scss'

const { Content } = Layout;

export const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const handleCollapse = (value: boolean) => {
    setCollapsed(value)
  };
  return (
    <Layout className={styles.layout}>
      <Sidebar
      collapsed={collapsed}
      onCollapse={handleCollapse}
      />

      <Layout className={styles.main}>
        <Header collapsed={collapsed} onToggleSidebar={toggleSidebar}/>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};