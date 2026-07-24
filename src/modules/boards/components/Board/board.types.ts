import type {
  CreateCardFormValues,
  EditCardFormValues,
} from "@/modules/boards/types/cardForm.types";
import type {
  CreateColumnFormValues,
  RenameColumnFormValues,
} from "@/modules/boards/types/columnForm.types";

export type CardActions = {
  onAdd: (columnId: string, data: CreateCardFormValues) => void;
  onUpdate: (cardId: string, data: EditCardFormValues) => void;
  onDelete: (cardId: string) => void;
};

export type ColumnActions = {
  onAdd: (data: CreateColumnFormValues) => void;
  onRename: (columnId: string, data: RenameColumnFormValues) => void;
  onDelete: (columnId: string) => void;
};

export type ColumnUiActions = {
  onOpenCreateCard: (columnId: string) => void;
  onOpenCardDetails: (cardId: string) => void;
  onOpenRenameColumn: (columnId: string) => void;
  onOpenDeleteColumn: (columnId: string) => void;
};
