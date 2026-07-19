import { Modal } from "antd";

interface DeleteTaskModalProps {
  open: boolean;
  cardTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteTaskModal = ({
  open,
  cardTitle,
  onClose,
  onConfirm,
}: DeleteTaskModalProps) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Удалить карточку"
      okText="Удалить"
      cancelText="Cancel"
      okType="danger"
      onOk={onConfirm}
      destroyOnHidden
    >
      <p>
        Удалить карточку &quot;{cardTitle}&quot;? Это действие нельзя отменить.
      </p>
    </Modal>
  );
};
