import { useRef } from "react";
import { Modal } from "antd";

interface DeleteColumnModalProps {
  open: boolean;
  columnTitle: string;
  cardsCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteColumnModal = ({
  open,
  columnTitle,
  cardsCount,
  onClose,
  onConfirm,
}: DeleteColumnModalProps) => {
  const contentRef = useRef<HTMLParagraphElement>(null);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Удалить колонку"
      okText="Удалить"
      cancelText="Отмена"
      okType="danger"
      onOk={onConfirm}
      destroyOnHidden
      focusTriggerAfterClose={false}
      afterOpenChange={(isOpen) => {
        if (isOpen) {
          contentRef.current?.focus();
        }
      }}
    >
      <p ref={contentRef} tabIndex={-1} style={{ outline: "none" }}>
        Удалить колонку &quot;{columnTitle}&quot; и {cardsCount}{" "}
        {cardsCount === 1 ? "карточку" : "карточек"}? Это действие нельзя
        отменить.
      </p>
    </Modal>
  );
};
