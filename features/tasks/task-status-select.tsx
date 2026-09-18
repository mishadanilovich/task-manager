"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { TASK_STATUSES, type TaskStatus } from "@/domain/task";
import type { ActionResult } from "@/lib/action-result";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { STATUS_VIEW, TaskStatusDot } from "./task-status";

export type TaskStatusSelectProps = {
  taskId: string;
  status: TaskStatus;
  action: (taskId: string, status: TaskStatus) => Promise<ActionResult>;
  className?: string;
};

export function TaskStatusSelect({ taskId, status, action, className }: TaskStatusSelectProps) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status);
  const [isPending, startTransition] = useTransition();

  const change = (next: string) => {
    startTransition(async () => {
      setOptimisticStatus(next as TaskStatus);
      const result = await action(taskId, next as TaskStatus);

      if (!result.ok) {
        toast.error(result.error, {
          action: { label: "Повторить", onClick: () => change(next) },
        });
      }
    });
  };

  return (
    <Select value={optimisticStatus} onValueChange={change} disabled={isPending}>
      <SelectTrigger
        className={className}
        aria-label={`Статус задачи: ${STATUS_VIEW[optimisticStatus].label}`}
      >
        <SelectValue>
          <span className="flex items-center gap-[7px]">
            <TaskStatusDot status={optimisticStatus} />
            {STATUS_VIEW[optimisticStatus].label}
          </span>
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {TASK_STATUSES.map((value) => (
          <SelectItem key={value} value={value}>
            <TaskStatusDot status={value} />
            {STATUS_VIEW[value].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
