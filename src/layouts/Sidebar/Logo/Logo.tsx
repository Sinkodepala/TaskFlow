import styles from "./Logo.module.scss"

type LogoProps = {
  collapsed: boolean;
}

export const Logo = ({ collapsed }: LogoProps) => {
  return (
    <div className={styles.logo}>
      {collapsed ? "TF" : "TaskFlow"}
    </div>
  );
};