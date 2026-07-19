import { useEffect } from "react";
import { Modal, Form, Input } from "antd";

import type { RenameColumnFormValues } from "@/modules/boards/types/columnForm.types";

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
  const [form] = Form.useForm<RenameColumnFormValues>();

  useEffect(() => {
    if (!open) return;

    form.setFieldsValue({ title: initialTitle });
  }, [open, initialTitle, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      onRename(values);

      form.resetFields();
    } catch (error) {
      console.log(`Validation failed : ${error}`);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title="Переименовать колонку"
      onOk={handleSubmit}
      okText="Сохранить"
      cancelText="Отмена"
      destroyOnHidden
      focusTriggerAfterClose={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            event.target instanceof HTMLInputElement
          ) {
            handleSubmit();
          }
        }}
      >
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
          <Input autoFocus />
        </Form.Item>
      </Form>
    </Modal>
  );
};
