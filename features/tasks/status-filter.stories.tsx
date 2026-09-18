import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { getRouter } from "@storybook/nextjs-vite/navigation.mock";
import { expect } from "storybook/test";

import { StatusFilter } from "./status-filter";

const meta = {
  title: "Tasks/StatusFilter",
  component: StatusFilter,
  args: {
    counters: { new: 4, in_progress: 2, done: 12, overdue: 2, total: 18 },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/lists/release-2-4" },
    },
  },
} satisfies Meta<typeof StatusFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FiltersByStatus: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("radio", { name: "Все: 18" })).toHaveAttribute(
      "aria-checked",
      "true",
    );

    await userEvent.click(canvas.getByRole("radio", { name: "Done: 12" }));

    await expect(getRouter().replace).toHaveBeenLastCalledWith("/lists/release-2-4?status=done", {
      scroll: false,
    });
  },
};
