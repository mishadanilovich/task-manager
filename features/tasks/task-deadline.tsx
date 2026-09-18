import { cn } from "cn";

import { getDeadlineDistance, getDeadlineState, splitDueAt } from "@/domain/deadline";
import type { Task } from "@/domain/task";
import { formatDeadline, formatDueAt, formatFullDate, formatShortDate } from "@/lib/format";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const STATE_CLASS = {
  overdue: "font-semibold text-overdue",
  soon: "font-semibold text-warning",
  scheduled: "font-medium",
  none: "text-muted-foreground",
} as const;

export type TaskDeadlineProps = {
  task: Task;
  now: Date;
  layout?: "stacked" | "inline";
};

export function TaskDeadline({ task, now, layout = "stacked" }: TaskDeadlineProps) {
  if (task.status === "done") {
    return (
      <span className="text-caption text-muted-foreground">
        Закрыто {formatShortDate(task.updatedAt)}
      </span>
    );
  }

  if (task.dueAt === null) {
    return <span className="text-caption text-muted-foreground">Без дедлайна</span>;
  }

  const state = getDeadlineState(task, now);
  const withTime = splitDueAt(task.dueAt).dueTime !== null;
  const label = formatDeadline(getDeadlineDistance(task.dueAt, now));

  if (layout === "inline") {
    return (
      <span className={cn("text-caption", STATE_CLASS[state])}>
        {label}{" "}
        <span className="font-mono font-normal text-muted-foreground">
          · {formatDueAt(task.dueAt, withTime)}
        </span>
      </span>
    );
  }

  return (
    <span className="flex flex-col gap-0.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("w-fit cursor-default text-caption", STATE_CLASS[state])}>
            {label}
          </span>
        </TooltipTrigger>
        <TooltipContent>{formatFullDate(task.dueAt, withTime)}</TooltipContent>
      </Tooltip>
      <span className="font-mono text-[11px] text-muted-foreground">
        {formatDueAt(task.dueAt, withTime)}
      </span>
    </span>
  );
}
