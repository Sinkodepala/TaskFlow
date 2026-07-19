import { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs from "dayjs";

import type { TaskCard } from "@/types/card";
import type { BoardColumn } from "@/types/column";
import type { EditCardFormValues } from "@/modules/boards/types/cardForm.types";
import { PriorityTag } from "@/modules/boards/components/TaskCard/PriorityTag/PriorityTag";

import styles from "./TaskDetailsModal.module.scss";

interface TaskDetailsModalProps {
  open: boolean;
  card: TaskCard | null;
  columns: BoardColumn[];
  onClose: () => void;
  onUpdate: (cardId: string, data: EditCardFormValues) => void;
  onDelete: () => void;
}

const formatDate = (value: string) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

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
      console.log(`Validation failed : ${error}`);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={isEditing ? "Edit card" : (card?.title ?? "Task details")}
      destroyOnHidden
      footer={
        card
          ? isEditing
            ? [
                <Button key="cancel" onClick={handleCancelEdit}>
                  Cancel
                </Button>,
                <Button key="save" type="primary" onClick={handleSave}>
                  Save
                </Button>,
              ]
            : [
                <Button key="delete" danger onClick={onDelete}>
                  Удалить
                </Button>,
                <Button key="edit" type="primary" onClick={() => setIsEditing(true)}>
                  Редактировать
                </Button>,
              ]
          : null
      }
    >
      {card &&
        (isEditing ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                event.target instanceof HTMLInputElement
              ) {
                handleSave();
              }
            }}
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[
                {
                  required: true,
                  message: "Введите название",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <Input.TextArea
                onPressEnter={(event) => event.stopPropagation()}
              />
            </Form.Item>

            <Form.Item name="priority" label="Priority">
              <Select>
                <Select.Option value="low">Low</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="high">High</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="columnId"
              label="Status"
              rules={[
                {
                  required: true,
                  message: "Выберите колонку",
                },
              ]}
            >
              <Select>
                {columns.map((column) => (
                  <Select.Option key={column.id} value={column.id}>
                    {column.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="dueDate" label="Due date">
              <DatePicker style={{ width: "100%" }} format="DD.MM.YYYY" />
            </Form.Item>
          </Form>
        ) : (
          <div className={styles.content}>
            <div className={styles.field}>
              <span className={styles.label}>Description</span>
              <p className={styles.value}>
                {card.description || "No description"}
              </p>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <span className={styles.label}>Priority</span>
                <PriorityTag priority={card.priority} />
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Status</span>
                <p className={styles.value}>{currentColumnTitle}</p>
              </div>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Due date</span>
              <p className={styles.value}>{formatDate(card.dueDate)}</p>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <span className={styles.label}>Created</span>
                <p className={styles.value}>{formatDate(card.createdAt)}</p>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Updated</span>
                <p className={styles.value}>{formatDate(card.updatedAt)}</p>
              </div>
            </div>
          </div>
        ))}
    </Modal>
  );
};
