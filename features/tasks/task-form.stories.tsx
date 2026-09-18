import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, waitFor } from "storybook/test";

import { taskFormSchema } from "@/domain/schemas";

import { EMPTY_TASK_FORM, TaskForm, type TaskFormProps } from "./task-form";

const meta = {
  title: "Tasks/TaskForm",
  component: TaskForm,
  args: {
    schema: taskFormSchema,
    defaultValues: EMPTY_TASK_FORM,
    submitLabel: "Создать задачу",
    action: fn<TaskFormProps["action"]>(async (values) => ({
      ok: true,
      data: { id: "task-new", title: values.title },
    })),
    onSuccess: fn(),
    onCancel: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-[640px] p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TaskForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CreatesTask: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText("Название"), "Разделить e2e на два джоба");
    await userEvent.click(canvas.getByRole("radio", { name: "High" }));
    await userEvent.click(canvas.getByRole("button", { name: "Создать задачу" }));

    await waitFor(() =>
      expect(args.action).toHaveBeenCalledWith({
        title: "Разделить e2e на два джоба",
        description: "",
        status: "new",
        priority: "high",
        dueDate: null,
        dueTime: null,
      }),
    );
    await expect(args.onSuccess).toHaveBeenCalledWith({
      id: "task-new",
      title: "Разделить e2e на два джоба",
    });
  },
};

export const RequiresTitle: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Создать задачу" }));

    await expect(await canvas.findByText("Название обязательно")).toBeVisible();
    await expect(canvas.getByLabelText("Название")).toHaveAttribute("aria-invalid", "true");
    await expect(args.action).not.toHaveBeenCalled();
  },
};
