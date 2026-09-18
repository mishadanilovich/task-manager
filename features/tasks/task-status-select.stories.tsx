import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import type { TaskStatus } from "@/domain/task";

import { TaskStatusSelect, type TaskStatusSelectProps } from "./task-status-select";

async function selectOption(name: string, click: (element: Element) => Promise<void>) {
  await click(await screen.findByRole("option", { name }));
  await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
}

function StatefulTaskStatusSelect(props: TaskStatusSelectProps) {
  const [status, setStatus] = useState<TaskStatus>(props.status);

  return (
    <TaskStatusSelect
      {...props}
      status={status}
      action={async (taskId, next) => {
        const result = await props.action(taskId, next);
        if (result.ok) setStatus(next);

        return result;
      }}
    />
  );
}

const meta = {
  title: "Tasks/TaskStatusSelect",
  component: TaskStatusSelect,
  render: (args) => <StatefulTaskStatusSelect {...args} />,
  args: {
    taskId: "task-1",
    status: "new",
    className: "w-44",
    action: fn<TaskStatusSelectProps["action"]>(async () => ({ ok: true, data: undefined })),
  },
} satisfies Meta<typeof TaskStatusSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ChangesStatus: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox");
    await expect(trigger).toHaveTextContent("New");

    await userEvent.click(trigger);
    await selectOption("In progress", userEvent.click);

    await waitFor(() => expect(args.action).toHaveBeenCalledWith("task-1", "in_progress"));
    await waitFor(() => expect(trigger).toHaveTextContent("In progress"));
  },
};

export const RollsBackOnError: Story = {
  args: {
    action: fn<TaskStatusSelectProps["action"]>(async () => ({
      ok: false,
      error: "Не удалось сохранить",
    })),
  },
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox");

    await userEvent.click(trigger);
    await selectOption("Done", userEvent.click);

    await waitFor(() => expect(args.action).toHaveBeenCalledWith("task-1", "done"));
    await waitFor(() => expect(trigger).toHaveTextContent("New"));
  },
};
