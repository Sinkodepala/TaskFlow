import type { CreateColumnFormValues } from "@/modules/boards/types/columnForm.types";
import { ColumnTitleModal } from "@/modules/boards/components/Modals/shared/ColumnTitleModal/ColumnTitleModal";

interface CreateColumnModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateColumnFormValues) => void;
}

export const CreateColumnModal = ({
  open,
  onClose,
  onCreate,
}: CreateColumnModalProps) => {
  return (
    <ColumnTitleModal
      open={open}
      title="Создать колонку"
      okText="Создать"
      onClose={onClose}
      onSubmit={onCreate}
    />
  );
};
