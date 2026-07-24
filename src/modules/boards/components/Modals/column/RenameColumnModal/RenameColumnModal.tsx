import type { RenameColumnFormValues } from "@/modules/boards/types/columnForm.types";
import { ColumnTitleModal } from "@/modules/boards/components/Modals/shared/ColumnTitleModal/ColumnTitleModal";

interface RenameColumnModalProps {
  open: boolean;
  initialTitle: string;
  onClose: () => void;
  onRename: (data: RenameColumnFormValues) => void;
}

export const RenameColumnModal = ({
  open,
  initialTitle,
  onClose,
  onRename,
}: RenameColumnModalProps) => {
  return (
    <ColumnTitleModal
      open={open}
      title="Переименовать колонку"
      okText="Сохранить"
      initialTitle={initialTitle}
      onClose={onClose}
      onSubmit={onRename}
    />
  );
};
