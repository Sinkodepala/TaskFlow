import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

interface CollapseIconProps {
  collapsed: boolean;
  size?: number;
}

export const CollapseIcon = ({
  collapsed,
  size = 10,
}: CollapseIconProps) => {
  return (
    <>
      {collapsed ? (
        <>
          <ArrowLeftOutlined style={{ fontSize: size }} />
          <ArrowRightOutlined style={{ fontSize: size }} />
        </>
      ) : (
        <>
          <ArrowRightOutlined style={{ fontSize: size }} />
          <ArrowLeftOutlined style={{ fontSize: size }} />
        </>
      )}
    </>
  );
};