import type { ReactNode } from "react";
import { DatePicker, Form, Input, Select } from "antd";

import type { TaskPriority } from "@/types/card";
import { priorityOptions } from "@/modules/boards/constants/priority";
import "@/modules/boards/styles/antDatePicker.css";

interface CardFormFieldsProps {
  autoFocusTitle?: boolean;
  priorityInitialValue?: TaskPriority;
  children?: ReactNode;
}

export const CardFormFields = ({
  autoFocusTitle = false,
  priorityInitialValue,
  children,
}: CardFormFieldsProps) => {
  return (
    <>
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
        <Input autoFocus={autoFocusTitle} />
      </Form.Item>

      <Form.Item name="description" label="Описание">
        <Input.TextArea onPressEnter={(event) => event.stopPropagation()} />
      </Form.Item>

      <Form.Item
        name="priority"
        label="Приоритет"
        initialValue={priorityInitialValue}
      >
        <Select>
          {priorityOptions.map(({ value, label }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {children}

      <Form.Item name="dueDate" label="Дедлайн">
        <DatePicker
          style={{ width: "100%" }}
          showTime={{ format: "HH:mm" }}
          format="DD.MM.YYYY HH:mm"
        />
      </Form.Item>
    </>
  );
};
