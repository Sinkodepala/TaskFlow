import { Modal, Form } from "antd";

import type { CreateCardFormValues } from "@/modules/boards/types/cardForm.types";
import { CardFormFields } from "@/modules/boards/components/Modals/shared/CardFormFields/CardFormFields";
import {
  boardModalDefaults,
  logFormValidationError,
} from "@/modules/boards/components/Modals/shared/modalDefaults";

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
      title="Создать карточку"
      onOk={handleSubmit}
      okText="Создать"
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
        <CardFormFields autoFocusTitle priorityInitialValue="medium" />
      </Form>
    </Modal>
  );
};
