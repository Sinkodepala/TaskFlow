import { useRef, type ReactNode } from "react";
import { Modal } from "antd";

import { boardModalDefaults } from "@/modules/boards/components/Modals/shared/modalDefaults";

import styles from "./ConfirmDeleteModal.module.scss";

interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal = ({
  open,
  title,
  children,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) => {
  const contentRef = useRef<HTMLParagraphElement>(null);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={title}
      okText="Удалить"
      cancelText="Отмена"
      okType="danger"
      onOk={onConfirm}
      {...boardModalDefaults}
      afterOpenChange={(isOpen) => {
        if (isOpen) {
          contentRef.current?.focus();
        }
      }}
    >
      <p ref={contentRef} tabIndex={-1} className={styles.content}>
        {children}
      </p>
    </Modal>
  );
};
