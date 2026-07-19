import { useEffect, useRef, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs from "dayjs";

import type { TaskCard } from "@/types/card";
import type { BoardColumn } from "@/types/column";
import type { EditCardFormValues } from "@/modules/boards/types/cardForm.types";
import { PriorityTag } from "@/modules/boards/components/TaskCard/PriorityTag/PriorityTag";
import { getDueDateStatus } from "@/modules/boards/utils/getDueDateStatus";

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

const formatDateTime = (value: string) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
      console.log(`Validation failed : ${error}`);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={isEditing ? "Редактировать карточку" : (card?.title ?? "Детали задачи")}
      destroyOnHidden
      focusTriggerAfterClose={false}
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
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item
              name="title"
              label="Название"
              rules={[
                {
                  required: true,
                  message: "Введите название",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="description" label="Описание">
              <Input.TextArea />
            </Form.Item>

            <Form.Item name="priority" label="Приоритет">
              <Select>
                <Select.Option value="low">Низкий</Select.Option>
                <Select.Option value="medium">Средний</Select.Option>
                <Select.Option value="high">Высокий</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="columnId"
              label="Статус"
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

            <Form.Item name="dueDate" label="Дедлайн">
              <DatePicker
                style={{ width: "100%" }}
                showTime={{ format: "HH:mm" }}
                format="DD.MM.YYYY HH:mm"
              />
            </Form.Item>
          </Form>
        ) : (
          <div ref={contentRef} className={styles.content} tabIndex={-1}>
            <div className={styles.field}>
              <span className={styles.label}>Описание</span>
              <p className={styles.value}>
                {card.description || "Нет описания"}
              </p>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <span className={styles.label}>Приоритет</span>
                <PriorityTag priority={card.priority} />
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Статус</span>
                <p className={styles.value}>{currentColumnTitle}</p>
              </div>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Дедлайн</span>
              <p
                className={`${styles.value} ${
                  card.dueDate
                    ? {
                        overdue: styles.valueOverdue,
                        soon: styles.valueSoon,
                        normal: "",
                      }[getDueDateStatus(card.dueDate)]
                    : ""
                }`}
              >
                {formatDateTime(card.dueDate)}
              </p>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <span className={styles.label}>Создано</span>
                <p className={styles.value}>{formatDate(card.createdAt)}</p>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Обновлено</span>
                <p className={styles.value}>{formatDate(card.updatedAt)}</p>
              </div>
            </div>
          </div>
        ))}
    </Modal>
  );
};
