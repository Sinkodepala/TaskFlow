import { ConfirmDeleteModal } from "@/modules/boards/components/Modals/shared/ConfirmDeleteModal/ConfirmDeleteModal";

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
    <ConfirmDeleteModal
      open={open}
      title="Удалить карточку"
      onClose={onClose}
      onConfirm={onConfirm}
    >
      Удалить карточку &quot;{cardTitle}&quot;? Это действие нельзя отменить.
    </ConfirmDeleteModal>
  );
};
