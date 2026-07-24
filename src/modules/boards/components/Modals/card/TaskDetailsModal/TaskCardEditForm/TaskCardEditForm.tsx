import { Form, Select } from "antd";
import type { FormInstance } from "antd";

import type { BoardColumn } from "@/types/column";
import type { EditCardFormValues } from "@/modules/boards/types/cardForm.types";
import { CardFormFields } from "@/modules/boards/components/Modals/shared/CardFormFields/CardFormFields";

interface TaskCardEditFormProps {
  form: FormInstance<EditCardFormValues>;
  columns: BoardColumn[];
  onFinish: () => void;
}

export const TaskCardEditForm = ({
  form,
  columns,
  onFinish,
}: TaskCardEditFormProps) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <CardFormFields>
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
      </CardFormFields>
    </Form>
  );
};
