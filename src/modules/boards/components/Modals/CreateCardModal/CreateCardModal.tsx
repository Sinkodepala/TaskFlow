import { Modal, Form, Input, Select, DatePicker } from "antd";

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
      title="Создать карточку"
      onOk={handleSubmit}
      okText="Создать"
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
        <Form.Item name="description" label="Описание">
          <Input.TextArea onPressEnter={(event) => event.stopPropagation()} />
        </Form.Item>
        <Form.Item name="priority" label="Приоритет" initialValue="medium">
          <Select>
            <Select.Option value="low">Низкий</Select.Option>
            <Select.Option value="medium">Средний</Select.Option>
            <Select.Option value="high">Высокий</Select.Option>
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
    </Modal>
  );
};
