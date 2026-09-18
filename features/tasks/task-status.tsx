import { cn } from "cn";

import type { TaskStatus } from "@/domain/task";

export const STATUS_VIEW: Record<TaskStatus, { label: string; dotClassName: string }> = {
  new: { label: "New", dotClassName: "bg-status-new" },
  in_progress: { label: "In progress", dotClassName: "bg-status-progress" },
  done: { label: "Done", dotClassName: "bg-status-done" },
};

export function TaskStatusDot({ status }: { status: TaskStatus }) {
  return (
    <span
      aria-hidden
      className={cn("size-[7px] shrink-0 rounded-[2px]", STATUS_VIEW[status].dotClassName)}
    />
  );
}
