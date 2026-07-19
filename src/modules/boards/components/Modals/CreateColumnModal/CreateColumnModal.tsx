import { Modal, Form, Input } from "antd";

import type { CreateColumnFormValues } from "@/modules/boards/types/columnForm.types";

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
  const [form] = Form.useForm<CreateColumnFormValues>();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      onCreate(values);

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
      title="Create column"
      onOk={handleSubmit}
      destroyOnHidden
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
      </Form>
    </Modal>
  );
};
