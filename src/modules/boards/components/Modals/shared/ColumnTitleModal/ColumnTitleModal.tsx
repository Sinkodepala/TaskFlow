import { useEffect } from "react";
import { Modal, Form, Input } from "antd";

import {
  boardModalDefaults,
  logFormValidationError,
} from "@/modules/boards/components/Modals/shared/modalDefaults";

interface ColumnTitleFormValues {
  title: string;
}

interface ColumnTitleModalProps {
  open: boolean;
  title: string;
  okText: string;
  initialTitle?: string;
  onClose: () => void;
  onSubmit: (data: ColumnTitleFormValues) => void;
}

export const ColumnTitleModal = ({
  open,
  title,
  okText,
  initialTitle,
  onClose,
  onSubmit,
}: ColumnTitleModalProps) => {
  const [form] = Form.useForm<ColumnTitleFormValues>();

  useEffect(() => {
    if (!open) return;

    if (initialTitle !== undefined) {
      form.setFieldsValue({ title: initialTitle });
    }
  }, [open, initialTitle, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      onSubmit(values);

      form.resetFields();
    } catch (error) {
      logFormValidationError(error);
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
      title={title}
      onOk={handleSubmit}
      okText={okText}
      cancelText="Отмена"
      {...boardModalDefaults}
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
