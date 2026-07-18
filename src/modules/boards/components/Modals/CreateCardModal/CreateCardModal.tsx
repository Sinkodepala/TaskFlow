import { Modal, Form, Input, Select } from "antd";

import type { CreateCardFormValues } from "@/modules/boards/types/cardForm.types";

interface CreateCardModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateCardFormValues) => void;
}

export const CreateCardModal = ({
  open,
  onClose,
  onCreate,
}: CreateCardModalProps) => {
  const [form] = Form.useForm<CreateCardFormValues>();
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
      title="Create card"
      onOk={handleSubmit}
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
        <Form.Item name="description" label="Description">
          <Input.TextArea onPressEnter={(event) => event.stopPropagation()} />
        </Form.Item>
        <Form.Item name="priority" label="Priority" initialValue="medium">
          <Select>
            <Select.Option value="low">Low</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="high">High</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
