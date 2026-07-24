import { useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "antd";
import dayjs from "dayjs";

import type { TaskCard } from "@/types/card";
import type { BoardColumn } from "@/types/column";
import type { EditCardFormValues } from "@/modules/boards/types/cardForm.types";
import { TaskDetailsView } from "@/modules/boards/components/Modals/card/TaskDetailsModal/TaskDetailsView/TaskDetailsView";
import { TaskCardEditForm } from "@/modules/boards/components/Modals/card/TaskDetailsModal/TaskCardEditForm/TaskCardEditForm";
import {
  boardModalDefaults,
  logFormValidationError,
} from "@/modules/boards/components/Modals/shared/modalDefaults";

interface TaskDetailsModalProps {
  open: boolean;
  card: TaskCard | null;
  columns: BoardColumn[];
  onClose: () => void;
  onUpdate: (cardId: string, data: EditCardFormValues) => void;
  onDelete: () => void;
}

export const TaskDetailsModal = ({
  open,
  card,
  columns,
  onClose,
  onUpdate,
  onDelete,
}: TaskDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm<EditCardFormValues>();
  const contentRef = useRef<HTMLDivElement>(null);

  const currentColumnId =
    columns.find((column) =>
      column.cards.some((columnCard) => columnCard.id === card?.id),
    )?.id ?? null;

  const currentColumnTitle =
    columns.find((column) => column.id === currentColumnId)?.title ?? "—";

  useEffect(() => {
    setIsEditing(false);
  }, [card?.id]);

  useEffect(() => {
    if (!isEditing || !card || !currentColumnId) return;

    form.setFieldsValue({
      title: card.title,
      description: card.description,
      priority: card.priority,
      dueDate: card.dueDate ? dayjs(card.dueDate) : null,
      columnId: currentColumnId,
    });
  }, [isEditing, card, currentColumnId, form]);

  const handleClose = () => {
    setIsEditing(false);
    form.resetFields();
    onClose();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSave = async () => {
    if (!card) return;

    try {
      const values = await form.validateFields();
      onUpdate(card.id, values);
      setIsEditing(false);
    } catch (error) {
      logFormValidationError(error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={
        isEditing ? "Редактировать карточку" : (card?.title ?? "Детали задачи")
      }
      {...boardModalDefaults}
      afterOpenChange={(isOpen) => {
        if (isOpen && !isEditing) {
          contentRef.current?.focus();
        }
      }}
      footer={
        card
          ? isEditing
            ? [
                <Button key="cancel" onClick={handleCancelEdit}>
                  Отмена
                </Button>,
                <Button key="save" type="primary" onClick={handleSave}>
                  Сохранить
                </Button>,
              ]
            : [
                <Button key="delete" danger onClick={onDelete}>
                  Удалить
                </Button>,
                <Button
                  key="edit"
                  type="primary"
                  onClick={() => setIsEditing(true)}
                >
                  Редактировать
                </Button>,
              ]
          : null
      }
    >
      {card &&
        (isEditing ? (
          <TaskCardEditForm
            form={form}
            columns={columns}
            onFinish={handleSave}
          />
        ) : (
          <TaskDetailsView
            card={card}
            columnTitle={currentColumnTitle}
            contentRef={contentRef}
          />
        ))}
    </Modal>
  );
};
